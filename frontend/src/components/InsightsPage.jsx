import { useMemo } from "react";
import { CATEGORIES } from "../constants";
import { dayKey, todayKey, getCategoryTotals } from "../utils";
import { tokens } from "../styles";
import SectionHeader from "./SectionHeader";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getWeeklyData(expenses) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    d.setHours(0, 0, 0, 0);
    const key = d.getTime();
    const total = expenses.filter(e => dayKey(e.ts) === key).reduce((s, e) => s + e.amount, 0);
    days.push({ label: d.toLocaleDateString("en-IN", { weekday: "short" }), total, key });
  }
  return days;
}

function getMonthlyData(expenses) {
  const months = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const start = d.getTime();
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
    const total = expenses.filter(e => e.ts >= start && e.ts < end).reduce((s, e) => s + e.amount, 0);
    months.push({ label: d.toLocaleDateString("en-IN", { month: "short" }), total });
  }
  return months;
}

function getTopItems(expenses) {
  const counts = {};
  expenses.forEach(e => {
    const key = e.name.toLowerCase();
    if (!counts[key]) counts[key] = { name: e.name, count: 0, total: 0, category: e.category };
    counts[key].count++;
    counts[key].total += e.amount;
  });
  return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
}

function getCanteenBreakdown(expenses) {
  const map = {};
  expenses.forEach(e => {
    map[e.canteen] = (map[e.canteen] || 0) + e.amount;
  });
  const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({ name, amount, pct: Math.round((amount / total) * 100) }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BarChart({ data, color = tokens.accent }) {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div style={s.barChart}>
      {data.map((d, i) => (
        <div key={i} style={s.barCol}>
          <div style={s.barValLabel}>
            {d.total > 0 && <span style={{ fontSize: 9, color: tokens.muted }}>₹{d.total}</span>}
          </div>
          <div style={s.barTrack}>
            <div style={{
              ...s.barFill,
              height: `${Math.max((d.total / max) * 100, d.total > 0 ? 4 : 0)}%`,
              background: d.key === todayKey()
                ? `linear-gradient(180deg,${tokens.accent2},${tokens.accent})`
                : color,
              opacity: d.total === 0 ? 0.2 : 1,
            }} />
          </div>
          <div style={s.barLabel}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function MonthlyBarChart({ data }) {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div style={s.barChart}>
      {data.map((d, i) => (
        <div key={i} style={s.barCol}>
          <div style={s.barValLabel}>
            {d.total > 0 && <span style={{ fontSize: 9, color: tokens.muted }}>₹{d.total}</span>}
          </div>
          <div style={s.barTrack}>
            <div style={{
              ...s.barFill,
              height: `${Math.max((d.total / max) * 100, d.total > 0 ? 4 : 0)}%`,
              background: i === data.length - 1
                ? `linear-gradient(180deg,${tokens.accent2},${tokens.accent})`
                : tokens.accent5,
              opacity: d.total === 0 ? 0.2 : 1,
            }} />
          </div>
          <div style={s.barLabel}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, color, emoji }) {
  return (
    <div style={s.statCard}>
      <div style={s.statEmoji}>{emoji}</div>
      <div style={{ ...s.statValue, color }}>{value}</div>
      <div style={s.statLabel}>{label}</div>
      {sub && <div style={s.statSub}>{sub}</div>}
    </div>
  );
}

function CategoryBar({ cat, amount, total }) {
  const pct = Math.round((amount / total) * 100);
  const info = CATEGORIES.find(c => c.name === cat) || CATEGORIES[1];
  return (
    <div style={s.catBarRow}>
      <div style={s.catBarLeft}>
        <span style={{ fontSize: 18 }}>{info.emoji}</span>
        <span style={s.catBarName}>{cat}</span>
      </div>
      <div style={s.catBarRight}>
        <div style={s.catBarTrack}>
          <div style={{ ...s.catBarFill, width: `${pct}%`, background: info.color }} />
        </div>
        <span style={{ ...s.catBarPct, color: info.color }}>{pct}%</span>
        <span style={s.catBarAmt}>₹{amount}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InsightsPage({ expenses, budget }) {
  const weeklyData   = useMemo(() => getWeeklyData(expenses),     [expenses]);
  const monthlyData  = useMemo(() => getMonthlyData(expenses),    [expenses]);
  const topItems     = useMemo(() => getTopItems(expenses),       [expenses]);
  const canteenData  = useMemo(() => getCanteenBreakdown(expenses), [expenses]);
  const catTotals    = useMemo(() => getCategoryTotals(expenses), [expenses]);

  const now        = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthSpent = expenses.filter(e => e.ts >= monthStart).reduce((sum, e) => sum + e.amount, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const uniqueDays = new Set(expenses.map(e => new Date(e.ts).toDateString())).size || 1;
  const dailyAvg   = Math.round(totalSpent / uniqueDays);
  const maxDay     = Math.max(...weeklyData.map(d => d.total), 0);
  const catTotal   = Object.values(catTotals).reduce((s, v) => s + v, 0) || 1;

  const savings = budget - monthSpent;

  if (expenses.length === 0) {
    return (
      <div style={s.emptyPage}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📊</div>
        <div style={{ fontFamily: tokens.fontDisplay, fontSize: 22, fontWeight: 800, marginBottom: 8 }}>No data yet</div>
        <div style={{ color: tokens.muted, fontSize: 14 }}>Log some expenses to unlock insights!</div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Page title */}
      <div style={s.pageHeader}>
        <div style={s.pageTitle}>Insights 📊</div>
        <div style={s.pageSub}>Your spending patterns at a glance</div>
      </div>

      {/* Quick summary cards */}
      <div style={s.summaryGrid}>
        <StatCard emoji="💸" label="This month"  value={`₹${monthSpent}`} color={tokens.accent}  />
        <StatCard emoji="📅" label="Daily avg"   value={`₹${dailyAvg}`}  color={tokens.accent2} />
        <StatCard emoji="🎯" label="Budget left" value={`₹${Math.max(0, savings)}`}
          color={savings >= 0 ? tokens.accent3 : tokens.red} />
        <StatCard emoji="🍽️" label="Total meals" value={expenses.length} color={tokens.accent5} />
      </div>

      {/* Weekly bar chart */}
      <SectionHeader title="This Week" />
      <div style={s.card}>
        <div style={s.cardLabel}>Daily spending — last 7 days</div>
        <BarChart data={weeklyData} color={tokens.accent} />
        <div style={s.chartMeta}>
          <span>Peak day: <strong style={{ color: tokens.accent2 }}>₹{maxDay}</strong></span>
          <span>Avg: <strong style={{ color: tokens.accent }}>₹{dailyAvg}</strong></span>
        </div>
      </div>

      {/* Monthly bar chart */}
      <SectionHeader title="Monthly Trend" />
      <div style={s.card}>
        <div style={s.cardLabel}>Spending over last 5 months</div>
        <MonthlyBarChart data={monthlyData} />
      </div>

      {/* Category breakdown */}
      <SectionHeader title="By Meal Type" />
      <div style={s.card}>
        {Object.entries(catTotals).length === 0
          ? <div style={{ color: tokens.muted, fontSize: 13 }}>No data yet</div>
          : Object.entries(catTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amt]) => (
                <CategoryBar key={cat} cat={cat} amount={amt} total={catTotal} />
              ))
        }
      </div>

      {/* Top items */}
      <SectionHeader title="Your Favourites 🏆" />
      <div style={s.card}>
        {topItems.length === 0
          ? <div style={{ color: tokens.muted, fontSize: 13 }}>No data yet</div>
          : topItems.map((item, i) => {
              const catInfo = CATEGORIES.find(c => c.name === item.category) || CATEGORIES[1];
              return (
                <div key={i} style={s.topItem}>
                  <div style={s.topRank}>{["🥇","🥈","🥉","4️⃣","5️⃣"][i]}</div>
                  <div style={s.topInfo}>
                    <div style={s.topName}>{item.name}</div>
                    <div style={s.topMeta}> {catInfo.emoji} {item.category}</div>
                  </div>
                  <div style={{ ...s.topAmt, color: catInfo.color }}>₹{item.total}</div>
                </div>
              );
            })
        }
      </div>

      {/* Canteen breakdown */}
      <SectionHeader title="By Canteen 🏫" />
      <div style={s.card}>
        {canteenData.map((c, i) => (
          <div key={i} style={s.canteenRow}>
            <div style={s.canteenName}>{c.name}</div>
            <div style={s.canteenBar}>
              <div style={{ ...s.canteenFill, width: `${c.pct}%` }} />
            </div>
            <div style={s.canteenAmt}>₹{c.amount}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 130 }} />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page: { animation: "fadeIn .3s ease" },
  emptyPage: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", minHeight: "70vh", textAlign: "center",
    padding: "0 32px", color: tokens.text,
  },
  pageHeader: { padding: "32px 20px 4px" },
  pageTitle:  { fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 800, color: tokens.text },
  pageSub:    { fontSize: 13, color: tokens.muted, marginTop: 4 },

  summaryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 16px 0" },
  statCard: {
    background: tokens.surface, border: `1px solid ${tokens.border}`,
    borderRadius: 16, padding: "16px 14px",
  },
  statEmoji: { fontSize: 20, marginBottom: 8 },
  statValue: { fontFamily: tokens.fontDisplay, fontSize: 22, fontWeight: 800, marginBottom: 2 },
  statLabel: { fontSize: 12, color: tokens.muted },
  statSub:   { fontSize: 11, color: tokens.muted, marginTop: 2 },

  card: {
    margin: "0 16px", background: tokens.surface, border: `1px solid ${tokens.border}`,
    borderRadius: 20, padding: "18px 16px", marginBottom: 2,
  },
  cardLabel: { fontSize: 12, color: tokens.muted, marginBottom: 14 },

  // Bar chart
  barChart: { display: "flex", alignItems: "flex-end", gap: 6, height: 120 },
  barCol:   { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" },
  barValLabel: { height: 18, display: "flex", alignItems: "center" },
  barTrack: { flex: 1, width: "100%", display: "flex", alignItems: "flex-end" },
  barFill:  { width: "100%", borderRadius: "5px 5px 0 0", transition: "height .6s cubic-bezier(.4,0,.2,1)", minHeight: 2 },
  barLabel: { fontSize: 10, color: tokens.muted, marginTop: 6, textAlign: "center" },
  chartMeta: { display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 12, color: tokens.muted },

  // Category bars
  catBarRow:  { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  catBarLeft: { display: "flex", alignItems: "center", gap: 8, width: 90, flexShrink: 0 },
  catBarName: { fontSize: 13, color: tokens.text, fontWeight: 500 },
  catBarRight:{ flex: 1, display: "flex", alignItems: "center", gap: 8 },
  catBarTrack:{ flex: 1, height: 8, background: "#ffffff0d", borderRadius: 99, overflow: "hidden" },
  catBarFill: { height: "100%", borderRadius: 99, transition: "width .6s cubic-bezier(.4,0,.2,1)" },
  catBarPct:  { fontSize: 12, fontWeight: 700, width: 30, textAlign: "right", flexShrink: 0 },
  catBarAmt:  { fontSize: 12, color: tokens.muted, width: 44, textAlign: "right", flexShrink: 0 },

  // Top items
  topItem: { display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${tokens.border}` },
  topRank: { fontSize: 20, flexShrink: 0 },
  topInfo: { flex: 1, minWidth: 0 },
  topName: { fontWeight: 600, fontSize: 14, color: tokens.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  topMeta: { fontSize: 11, color: tokens.muted, marginTop: 2 },
  topAmt:  { fontFamily: tokens.fontDisplay, fontWeight: 700, fontSize: 15, flexShrink: 0 },

  // Canteen
  canteenRow:  { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  canteenName: { fontSize: 13, color: tokens.text, width: 100, flexShrink: 0, fontWeight: 500 },
  canteenBar:  { flex: 1, height: 8, background: "#ffffff0d", borderRadius: 99, overflow: "hidden" },
  canteenFill: { height: "100%", borderRadius: 99, background: `linear-gradient(90deg,${tokens.accent},${tokens.accent2})`, transition: "width .6s ease" },
  canteenAmt:  { fontSize: 12, color: tokens.muted, width: 50, textAlign: "right", flexShrink: 0 },
};
