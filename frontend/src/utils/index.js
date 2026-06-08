export function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function dayKey(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function todayKey() {
  return dayKey(Date.now());
}

export function dateLabel(ts) {
  const d = new Date(ts).toDateString();
  if (d === new Date().toDateString())                     return "Today";
  if (d === new Date(Date.now() - 86400000).toDateString()) return "Yesterday";
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function groupExpensesByDate(expenses) {
  const groups = [];
  let lastLabel = "";
  expenses.forEach(e => {
    const lbl = dateLabel(e.ts);
    if (lbl !== lastLabel) { groups.push({ type: "label", lbl }); lastLabel = lbl; }
    groups.push({ type: "expense", ...e });
  });
  return groups;
}

export function calcStreak(expenses) {
  const ds = new Set(expenses.map(e => dayKey(e.ts)));
  let count = 0;
  let d = todayKey();
  while (ds.has(d)) { count++; d -= 86400000; }
  return count;
}

export function getCategoryTotals(expenses) {
  return expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
}
