import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api";

const STORAGE_KEY_BUDGET = "nomnom_budget";

function loadBudget() {
  return parseInt(localStorage.getItem(STORAGE_KEY_BUDGET) || "3000");
}

// user = Firebase user object (needed to get auth token for every request)
export function useExpenses(user) {
  const [expenses, setExpenses] = useState([]);
  const [budget,   setBudget]   = useState(loadBudget);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  // ─── Load transactions from backend whenever user signs in ──────────────────
  useEffect(() => {
    if (!user) {
      setExpenses([]); // clear data on sign-out
      return;
    }

    setLoading(true);
    setError(null);

    apiRequest(user, "/transactions")
      .then((data) => {
        // Backend returns MongoDB docs with `_id`; normalise to `id` for the UI
        setExpenses(data.map(normalise));
      })
      .catch((err) => {
        console.error("Failed to load transactions:", err);
        setError("Could not load transactions. Check your connection.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  // ─── Budget (still local — it's a personal preference, not per-device data) ─
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BUDGET, budget);
  }, [budget]);

  // ─── Add ────────────────────────────────────────────────────────────────────
  const addExpense = useCallback(async (expense) => {
    if (!user) return;
    try {
      const saved = await apiRequest(user, "/transactions", {
        method: "POST",
        body: expense,
      });
      // Prepend to list so it appears at the top immediately
      setExpenses((prev) => [normalise(saved), ...prev]);
    } catch (err) {
      console.error("Failed to add transaction:", err);
      throw err; // let the caller show a toast
    }
  }, [user]);

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const deleteExpense = useCallback(async (id) => {
    if (!user) return;
    // Optimistic update: remove from UI immediately, restore if request fails
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    try {
      await apiRequest(user, `/transactions/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      // Reload to restore correct state
      const data = await apiRequest(user, "/transactions");
      setExpenses(data.map(normalise));
    }
  }, [user]);

  const updateBudget = useCallback((value) => {
    setBudget(value);
  }, []);

  return { expenses, budget, loading, error, addExpense, deleteExpense, updateBudget };
}

// MongoDB returns _id, the UI expects id — normalise here once
function normalise(doc) {
  return { ...doc, id: doc._id || doc.id };
}
