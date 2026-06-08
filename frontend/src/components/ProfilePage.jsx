import { useState, useMemo } from "react";
import { CATEGORIES } from "../constants";
import { dayKey, calcStreak } from "../utils";
import { tokens } from "../styles";
import SectionHeader from "./SectionHeader";

// ─── Achievement definitions ──────────────────────────────────────────────────

function getAchievements(expenses, budget, streak) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthSpent = expenses.filter(e => e.ts >= monthStart).reduce((s, e) => s + e.amount, 0);

  return [
    {
      id: "first_bite",
      emoji: "🍴",
      title: "First Bite",
      desc: "Logged your first meal",
      unlocked: expenses.length >= 1,
      color: tokens.accent3,
    },
    {
      id: "streak_3",
      emoji: "🔥",
      title: "On Fire",
      desc: "3-day logging streak",
      unlocked: streak >= 3,
      color: tokens.accent4,
    },
    {
      id: "streak_7",
      emoji: "⚡",
      title: "Week Warrior",
      desc: "7-day logging streak",
      unlocked: streak >= 7,
      color: "#facc15",
    },
    {
      id: "meals_10",
      emoji: "🍽️",
      title: "Regular",
      desc: "Logged 10 meals",
      unlocked: expenses.length >= 10,
      color: tokens.accent5,
    },
    {
      id: "budget_hero",
      emoji: "💰",
      title: "Budget Hero",
      desc: "Stayed under budget this month",
      unlocked: monthSpent < budget && expenses.length > 0,
      color: tokens.accent3,
    },
    {
      id: "variety",
      emoji: "🌈",
      title: "Foodie",
      desc: "Tried all 4 meal types",
      unlocked: new Set(expenses.map(e => e.category)).size === 4,
      color: tokens.accent,
    },
    {
      id: "canteen_hopper",
      emoji: "🏃",
      title: "Canteen Hopper",
      desc: "Visited 4+ different canteens",
      unlocked: new Set(expenses.map(e => e.canteen)).size >= 4,
      color: tokens.accent2,
    },
    {
      id: "century",
      emoji: "💯",
      title: "Century",
      desc: "Spent over ₹100 in a day",
      unlocked: (() => {
        const daily = {};
        expenses.forEach(e => { daily[dayKey(e.ts)] = (daily[dayKey(e.ts)] || 0) + e.amount; });
        return Object.values(daily).some(v => v >= 100);
      })(),
      color: "#f87171",
    },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, photoURL }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={s.avatar}>
      {photoURL
        ? <img src={photoURL} alt={name} style={s.avatarPhoto} referrerPolicy="no-referrer" />
        : <div style={s.avatarInner}>{initials}</div>
      }
    </div>
  );
}

function AchievementBadge({ badge }) {
  return (
    <div style={{
      ...s.badge,
      opacity: badge.unlocked ? 1 : 0.35,
      background: badge.unlocked ? `${badge.color}18` : tokens.surface2,
      borderColor: badge.unlocked ? `${badge.color}44` : tokens.border,
    }}>
      <div style={s.badgeEmoji}>{badge.emoji}</div>
      <div style={{ ...s.badgeTitle, color: badge.unlocked ? badge.color : tokens.muted }}>
        {badge.title}
      </div>
      <div style={s.badgeDesc}>{badge.desc}</div>
      {badge.unlocked && <div style={s.badgeUnlocked}>✓</div>}
    </div>
  );
}

function SettingRow({ icon, label, value, onToggle, isToggle, onClick }) {
  const [on, setOn] = useState(value);
  const handle = () => {
    if (isToggle) { setOn(v => !v); onToggle?.(!on); }
    else onClick?.();
  };
  return (
    <div style={s.settingRow} onClick={handle}>
      <span style={s.settingIcon}>{icon}</span>
      <span style={s.settingLabel}>{label}</span>
      {isToggle
        ? <div style={{ ...s.toggle, background: on ? tokens.accent : tokens.surface2 }}>
            <div style={{ ...s.toggleKnob, transform: on ? "translateX(20px)" : "translateX(2px)" }} />
          </div>
        : <span style={s.settingChevron}>›</span>
      }
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage({ expenses, budget, onUpdateBudget, onClearData, showToast, user, onSignOut }) {
  const googleName = user?.displayName || "";
  const [name, setName]         = useState(() => localStorage.getItem("cashcue_name") || googleName || "Campus Student");
  const [college, setCollege]   = useState(() => localStorage.getItem("cashcue_college") || "My College");
  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempCollege, setTempCollege] = useState(college);

  const streak       = useMemo(() => calcStreak(expenses), [expenses]);
  const achievements = useMemo(() => getAchievements(expenses, budget, streak), [expenses, budget, streak]);
  const unlocked     = achievements.filter(a => a.unlocked).length;

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const uniqueDays = new Set(expenses.map(e => new Date(e.ts).toDateString())).size || 1;
  const dailyAvg   = Math.round(totalSpent / uniqueDays);
  const favCat     = (() => {
    const m = {};
    expenses.forEach(e => { m[e.category] = (m[e.category] || 0) + 1; });
    const top = Object.entries(m).sort((a, b) => b[1] - a[1])[0];
    return top ? CATEGORIES.find(c => c.name === top[0]) : null;
  })();

  const saveProfile = () => {
    setName(tempName || "Campus Student");
    setCollege(tempCollege || "My College");
    localStorage.setItem("cashcue_name", tempName || "Campus Student");
    localStorage.setItem("cashcue_college", tempCollege || "My College");
    setEditMode(false);
    showToast("Profile saved! ✨");
  };

  const handleClear = () => {
    if (window.confirm("Delete all expense history? This cannot be undone.")) {
      onClearData();
      showToast("History cleared 🗑️");
    }
  };

  return (
    <div style={s.page}>
      {/* Profile hero */}
      <div style={s.hero}>
        <Avatar name={name} photoURL={user?.photoURL} />
        {editMode ? (
          <div style={s.editFields}>
            <input
              style={s.editInput}
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              placeholder="Your name"
              autoFocus
            />
            <input
              style={s.editInput}
              value={tempCollege}
              onChange={e => setTempCollege(e.target.value)}
              placeholder="College name"
            />
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button style={s.saveBtn} onClick={saveProfile}>Save</button>
              <button style={s.cancelBtn} onClick={() => { setEditMode(false); setTempName(name); setTempCollege(college); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={s.heroInfo}>
            <div style={s.heroName}>{name}</div>
            <div style={s.heroCollege}>{college}</div>
            {user?.email && (
              <div style={s.heroEmail}>{user.email}</div>
            )}
            <div style={s.heroBadge}>
              {favCat ? `${favCat.emoji} ${favCat.name} lover` : "🍽️ Food explorer"}
            </div>
            <div style={s.heroActions}>
              <button style={s.editProfileBtn} onClick={() => setEditMode(true)}>✏️ Edit</button>
              <button style={s.signOutBtn} onClick={onSignOut}>Sign out</button>
            </div>
          </div>
        )}
      </div>

      {/* Lifetime stats */}
      <div style={s.statsGrid}>
        {[
          { emoji: "💸", val: `₹${totalSpent}`, lbl: "total spent", color: tokens.accent },
          { emoji: "🔥", val: streak,            lbl: "day streak",  color: tokens.accent4 },
          { emoji: "📅", val: `₹${dailyAvg}`,   lbl: "daily avg",   color: tokens.accent2 },
          { emoji: "🍴", val: expenses.length,   lbl: "meals logged",color: tokens.accent5 },
        ].map(({ emoji, val, lbl, color }) => (
          <div key={lbl} style={s.statCard}>
            <div style={s.statEmoji}>{emoji}</div>
            <div style={{ ...s.statVal, color }}>{val}</div>
            <div style={s.statLbl}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <SectionHeader title={`Achievements 🏆 (${unlocked}/${achievements.length})`} />
      <div style={s.badgesWrap}>
        <div style={s.badgesGrid}>
          {achievements.map(b => <AchievementBadge key={b.id} badge={b} />)}
        </div>
      </div>

      {/* Budget setting */}
      <SectionHeader title="Budget" />
      <div style={s.card}>
        <div style={s.budgetRow}>
          <div>
            <div style={s.budgetLabel}>Monthly food budget</div>
            <div style={{ ...s.budgetVal, color: tokens.accent }}>₹{budget}</div>
          </div>
          <button style={s.budgetEditBtn} onClick={onUpdateBudget}>Change</button>
        </div>
        <div style={s.budgetBarTrack}>
          <div style={{
            ...s.budgetBarFill,
            width: `${Math.min(100, Math.round((expenses.filter(e => {
              const now = new Date(); const ms = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
              return e.ts >= ms;
            }).reduce((s, e) => s + e.amount, 0) / budget) * 100))}%`,
          }} />
        </div>
      </div>

      {/* Settings */}
      <SectionHeader title="Settings" />
      <div style={s.card}>
        <SettingRow icon="🔔" label="Meal reminders"       isToggle value={true} />
        <SettingRow icon="📊" label="Weekly report"        isToggle value={false} />
        <SettingRow icon="🌙" label="Dark mode"            isToggle value={true} />
        <SettingRow icon="💾" label="Auto-save expenses"   isToggle value={true} />
        <div style={s.divider} />
        <SettingRow icon="🗑️" label="Clear expense history" onClick={handleClear} />
      </div>

      {/* App info */}
      <div style={s.appInfo}>
        <div style={s.appLogo}>CashCue</div>
        <div style={s.appVer}>v1.0.0 • Made with ❤️ for campus life</div>
      </div>

      <div style={{ height: 130 }} />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page: { animation: "fadeIn .3s ease" },

  hero: {
    margin: "24px 16px 0",
    background: "linear-gradient(135deg,#1a1032,#12101f)",
    border: `1px solid ${tokens.border2}`,
    borderRadius: 24, padding: 24,
    display: "flex", alignItems: "center", gap: 20,
  },
  avatar: {
    width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
    background: "linear-gradient(135deg,#c084fc,#f472b6)",
    padding: 3,
  },
  avatarInner: {
    width: "100%", height: "100%", borderRadius: "50%",
    background: "#1a1032", display: "flex", alignItems: "center",
    justifyContent: "center", fontFamily: tokens.fontDisplay,
    fontSize: 24, fontWeight: 800, color: tokens.text,
  },
  heroInfo:    { flex: 1, minWidth: 0 },
  heroName:    { fontFamily: tokens.fontDisplay, fontSize: 20, fontWeight: 800, color: tokens.text, marginBottom: 2 },
  heroCollege: { fontSize: 12, color: tokens.muted, marginBottom: 6 },
  heroBadge:   { display: "inline-block", background: "rgba(192,132,252,.15)", border: "1px solid rgba(192,132,252,.3)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: tokens.accent, marginBottom: 10 },
  editProfileBtn: { background: "none", border: `1px solid ${tokens.border2}`, borderRadius: 10, padding: "5px 12px", fontSize: 12, color: tokens.muted, cursor: "pointer", fontFamily: tokens.fontSans },

  editFields:  { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
  editInput:   { background: "#ffffff08", border: `1px solid ${tokens.border2}`, borderRadius: 10, padding: "8px 12px", fontSize: 14, color: tokens.text, fontFamily: tokens.fontSans, outline: "none" },
  saveBtn:     { flex: 1, background: "linear-gradient(135deg,#c084fc,#f472b6)", border: "none", borderRadius: 10, padding: "8px 0", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: tokens.fontSans },
  cancelBtn:   { flex: 1, background: tokens.surface2, border: `1px solid ${tokens.border}`, borderRadius: 10, padding: "8px 0", fontSize: 13, color: tokens.muted, cursor: "pointer", fontFamily: tokens.fontSans },

  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "14px 16px 0" },
  statCard:  { background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 16, padding: "14px 12px", textAlign: "center" },
  statEmoji: { fontSize: 20, marginBottom: 6 },
  statVal:   { fontFamily: tokens.fontDisplay, fontSize: 20, fontWeight: 800, marginBottom: 2 },
  statLbl:   { fontSize: 11, color: tokens.muted },

  badgesWrap: { margin: "0 16px" },
  badgesGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 },
  badge: {
    border: "1px solid", borderRadius: 14, padding: "10px 6px",
    textAlign: "center", cursor: "default", position: "relative",
    transition: ".2s",
  },
  badgeEmoji:   { fontSize: 22, marginBottom: 4 },
  badgeTitle:   { fontSize: 10, fontWeight: 700, marginBottom: 2 },
  badgeDesc:    { fontSize: 9, color: tokens.muted, lineHeight: 1.3 },
  badgeUnlocked:{ position: "absolute", top: 5, right: 6, fontSize: 9, color: tokens.accent3, fontWeight: 700 },

  card: {
    margin: "0 16px", background: tokens.surface, border: `1px solid ${tokens.border}`,
    borderRadius: 20, padding: "16px", marginBottom: 2,
  },

  budgetRow:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  budgetLabel:  { fontSize: 12, color: tokens.muted, marginBottom: 4 },
  budgetVal:    { fontFamily: tokens.fontDisplay, fontSize: 26, fontWeight: 800 },
  budgetEditBtn:{ background: "linear-gradient(135deg,#c084fc,#f472b6)", border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: tokens.fontSans },
  budgetBarTrack:{ background: "#ffffff0d", borderRadius: 99, height: 6, overflow: "hidden" },
  budgetBarFill: { height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#c084fc,#f472b6)", transition: "width .6s ease" },

  settingRow: {
    display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
    borderBottom: `1px solid ${tokens.border}`, cursor: "pointer",
  },
  settingIcon:    { fontSize: 18, flexShrink: 0 },
  settingLabel:   { flex: 1, fontSize: 14, color: tokens.text },
  settingChevron: { fontSize: 20, color: tokens.muted },
  toggle:         { width: 40, height: 22, borderRadius: 99, transition: ".3s", position: "relative", flexShrink: 0 },
  toggleKnob:     { position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: ".3s" },

  divider: { borderTop: `1px solid ${tokens.border}`, margin: "4px 0" },

  appInfo:  { textAlign: "center", padding: "28px 20px 0", color: tokens.muted },
  appLogo:  { fontFamily: tokens.fontDisplay, fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,#c084fc,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 4 },
  appVer:   { fontSize: 12 },

  avatarPhoto: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" },
  heroEmail:   { fontSize: 11, color: tokens.muted, marginBottom: 6 },
  heroActions: { display: "flex", gap: 8, marginTop: 4 },
  signOutBtn:  { background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.25)", borderRadius: 10, padding: "5px 12px", fontSize: 12, color: tokens.red, cursor: "pointer", fontFamily: tokens.fontSans },
};
