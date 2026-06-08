import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY_BUDGET = "cashcue_budget";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function loadBudget() {
  return parseInt(localStorage.getItem(STORAGE_KEY_BUDGET) || "3000");
}

function mapServerToExpense(item) {
  return {
    id: item._id || item.id,
    name: item.name || "",
    amount: item.amount || 0,
    category: item.category || "",
    canteen: item.canteen || "",
    ts: item.ts || (item.date ? new Date(item.date).getTime() : Date.now()),
  };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(loadBudget);

  // load from server
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/transactions`);
        if (!res.ok) throw new Error("Network");
        const data = await res.json();
        if (!cancelled) setExpenses(data.map(mapServerToExpense));
      } catch (e) {
        // no demo fallback — start empty if server unavailable
        if (!cancelled) setExpenses([]);
      }
    })();
    return () => { cancelled = true };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BUDGET, budget);
  }, [budget]);

  const addExpense = useCallback(async (expense) => {
    // send to server
    try {
      const body = {
        name: expense.name,
        amount: expense.amount,
        category: expense.category,
        canteen: expense.canteen,
        ts: expense.ts || Date.now(),
      };

      const res = await fetch(`${API_BASE}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      setExpenses(prev => [mapServerToExpense(created), ...prev]);
    } catch (e) {
      // optimistic local-only fallback
      setExpenses(prev => [expense, ...prev]);
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      // local fallback
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  }, []);

  const updateBudget = useCallback((value) => {
    setBudget(value);
  }, []);

  return { expenses, budget, addExpense, deleteExpense, updateBudget };
}
