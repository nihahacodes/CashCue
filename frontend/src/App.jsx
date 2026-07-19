import { useState, useCallback } from "react";

import { useExpenses }  from "./hooks/useExpenses";
import { useToast }     from "./hooks/useToast";
import { useAuth }      from "./hooks/useAuth";

import { dayKey, todayKey, calcStreak, getCategoryTotals } from "./utils";
import { globalStyles, tokens } from "./styles";

import AmbientBackground from "./components/AmbientBackground";
import BottomNav         from "./components/BottomNav";
import AddExpenseModal   from "./components/AddExpenseModal";
import Toast             from "./components/Toast";

import LoginPage    from "./components/LoginPage";
import HomePage     from "./components/HomePage";
import InsightsPage from "./components/InsightsPage";
import CanteensPage from "./components/CanteensPage";
import ProfilePage  from "./components/ProfilePage";

export default function App() {
  const { user, loading: authLoading, error: authError, signInWithGoogle, signOutUser } = useAuth();

  // Pass `user` so the hook can attach the auth token to every API request
  const { expenses, budget, loading: expLoading, error: expError, addExpense, deleteExpense, updateBudget } = useExpenses(user);

  const { toast, showToast } = useToast();
  const [activePage, setActivePage] = useState("home");
  const [showModal,  setShowModal]  = useState(false);

  // ─── Derived values ────────────────────────────────────────────────────────
  const now        = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthSpent = expenses.filter(e => e.ts >= monthStart).reduce((s, e) => s + e.amount, 0);
  const todaySpent = expenses.filter(e => dayKey(e.ts) === todayKey()).reduce((s, e) => s + e.amount, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const uniqueDays = new Set(expenses.map(e => new Date(e.ts).toDateString())).size || 1;
  const dailyAvg   = Math.round(totalSpent / uniqueDays);
  const catTotals  = getCategoryTotals(expenses);
  const streak     = calcStreak(expenses);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleAdd = useCallback(async (expense) => {
    try {
      await addExpense(expense);
      showToast(`Logged ${expense.name} for ₹${expense.amount} 🎉`);
    } catch {
      showToast("Failed to save — check your connection");
    }
  }, [addExpense, showToast]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteExpense(id);
      showToast("Removed 🗑️");
    } catch {
      showToast("Failed to delete");
    }
  }, [deleteExpense, showToast]);

  const handleEditBudget = useCallback(() => {
    const input = prompt("Set your monthly food budget (₹):", budget);
    if (input && parseInt(input) > 0) {
      updateBudget(parseInt(input));
      showToast("Budget updated! 💰");
    }
  }, [budget, updateBudget, showToast]);

  const handleClearData = useCallback(() => {
    expenses.forEach(e => deleteExpense(e.id));
  }, [expenses, deleteExpense]);

  const handleSignOut = useCallback(async () => {
    await signOutUser();
    setActivePage("home");
    showToast("Signed out 👋");
  }, [signOutUser, showToast]);

  // ─── Auth loading ──────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={styles.splash}>
        <style>{globalStyles}</style>
        <div style={styles.splashText}>CashCue</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <style>{globalStyles}</style>
        <LoginPage onSignIn={signInWithGoogle} error={authError} loading={authLoading} />
        <Toast {...toast} />
      </>
    );
  }

  // ─── Page routing ──────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <HomePage
            expenses={expenses}
            budget={budget}
            monthSpent={monthSpent}
            todaySpent={todaySpent}
            dailyAvg={dailyAvg}
            catTotals={catTotals}
            streak={streak}
            onDelete={handleDelete}
            onEditBudget={handleEditBudget}
            loading={expLoading}
            error={expError}
          />
        );
      case "stats":
        return <InsightsPage expenses={expenses} budget={budget} />;
      case "campus":
        return <CanteensPage expenses={expenses} />;
      case "profile":
        return (
          <ProfilePage
            expenses={expenses}
            budget={budget}
            onUpdateBudget={handleEditBudget}
            onClearData={handleClearData}
            showToast={showToast}
            user={user}
            onSignOut={handleSignOut}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.app}>
      <style>{globalStyles}</style>
      <AmbientBackground />

      {/* Global error banner if backend is unreachable */}
      {expError && (
        <div style={styles.errorBanner}>{expError}</div>
      )}

      <div style={styles.inner}>
        {renderPage()}
      </div>

      {activePage === "home" && (
        <button style={styles.fab} onClick={() => setShowModal(true)} aria-label="Add expense">
          +
        </button>
      )}

      <BottomNav active={activePage} onNav={setActivePage} />

      {showModal && (
        <AddExpenseModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}

      <Toast {...toast} />
    </div>
  );
}

const styles = {
  app: {
    background: tokens.bg,
    minHeight: "100vh",
    fontFamily: tokens.fontSans,
    color: tokens.text,
    position: "relative",
    overflowX: "hidden",
  },
  inner: {
    maxWidth: 460,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  fab: {
    position: "fixed",
    bottom: 80,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: tokens.accent,
    border: "none",
    cursor: "pointer",
    fontSize: 24,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
    zIndex: 100,
    fontFamily: "monospace",
    transition: ".15s",
  },
  splash: {
    minHeight: "100vh",
    background: tokens.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  splashText: {
    fontSize: 20,
    fontWeight: 700,
    color: tokens.text,
    letterSpacing: "-0.02em",
    fontFamily: tokens.fontSans,
  },
  errorBanner: {
    background: tokens.redDim,
    borderBottom: `1px solid rgba(239,68,68,0.2)`,
    padding: "8px 16px",
    fontSize: 12,
    color: tokens.red,
    textAlign: "center",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
};
