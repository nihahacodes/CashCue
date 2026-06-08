import { useState, useCallback } from "react";

import { useExpenses }  from "./hooks/useExpenses";
import { useToast }     from "./hooks/useToast";
import { useAuth }      from "./hooks/useAuth";

import { dayKey, todayKey, calcStreak, getCategoryTotals } from "./utils";
import { globalStyles, tokens } from "./styles";

// Layout
import AmbientBackground from "./components/AmbientBackground";
import BottomNav         from "./components/BottomNav";
import AddExpenseModal   from "./components/AddExpenseModal";
import Toast             from "./components/Toast";

// Pages
import LoginPage    from "./components/LoginPage";
import HomePage     from "./components/HomePage";
import InsightsPage from "./components/InsightsPage";
import CanteensPage from "./components/CanteensPage";
import ProfilePage  from "./components/ProfilePage";

export default function App() {
  const { user, loading: authLoading, error: authError, signInWithGoogle, signOutUser } = useAuth();
  const { expenses, budget, addExpense, deleteExpense, updateBudget } = useExpenses();
  const { toast, showToast } = useToast();
  const [activePage, setActivePage] = useState("home");
  const [showModal,  setShowModal]  = useState(false);

  // ─── Shared derived values ─────────────────────────────────────────────────
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
  const handleAdd = useCallback((expense) => {
    addExpense(expense);
    showToast(`Logged ${expense.name} for ₹${expense.amount} 🎉`);
  }, [addExpense, showToast]);

  const handleDelete = useCallback((id) => {
    deleteExpense(id);
    showToast("Removed 🗑️");
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

  // ─── Auth loading screen ───────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={styles.splash}>
        <style>{globalStyles}</style>
        <div style={styles.splashLogo}></div>
        <div style={styles.splashText}>CashCue</div>
      </div>
    );
  }

  // ─── Not signed in → show login ───────────────────────────────────────────
  if (!user) {
    return (
      <>
        <style>{globalStyles}</style>
        <LoginPage
          onSignIn={signInWithGoogle}
          error={authError}
          loading={authLoading}
        />
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
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
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
    width: 58,
    height: 58,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#c084fc,#f472b6)",
    border: "none",
    cursor: "pointer",
    fontSize: 28,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 30px rgba(192,132,252,.4)",
    zIndex: 100,
    fontFamily: "monospace",
    transition: ".2s",
  },
  // Loading splash
  splash: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  splashLogo: { fontSize: 56, marginBottom: 12 },
  splashText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    background: "linear-gradient(135deg,#c084fc,#f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
};
