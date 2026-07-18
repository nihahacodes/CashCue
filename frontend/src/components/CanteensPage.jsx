import { useMemo, useState } from "react";
import { CANTEENS, CATEGORIES } from "../constants";
import { tokens } from "../styles";
import SectionHeader from "./SectionHeader";

// ─── Rich canteen data (static info + computed spend) ─────────────────────────

const CANTEEN_META = {
  "Main Canteen": {
    emoji: "🍽️",
    hours: "7:30 AM – 9:00 PM",
    tags: ["South Indian", "Snacks", "Rice"],
    color: tokens.accent,
    accent: "rgba(192,132,252,.12)",
    popular: ["Masala Dosa", "Idli Sambar", "Veg Biryani"],
    rating: 4.2,
    location: "Block A, Ground Floor",
  },
  "North Block": {
    emoji: "🍛",
    hours: "8:00 AM – 8:00 PM",
    tags: ["North Indian", "Biryani", "Thali"],
    color: tokens.accent2,
    accent: "rgba(244,114,182,.12)",
    popular: ["Chicken Biryani", "Dal Tadka", "Butter Naan"],
    rating: 4.5,
    location: "North Block, 1st Floor",
  },
  "South Cafe": {
    emoji: "☕",
    hours: "9:00 AM – 6:00 PM",
    tags: ["Snacks", "Cafe", "Beverages"],
    color: tokens.accent5,
    accent: "rgba(96,165,250,.12)",
    popular: ["Cold Coffee", "Samosa", "Sandwich"],
    rating: 4.0,
    location: "Arts Block, Ground Floor",
  },
  "Hostel Mess": {
    emoji: "🏠",
    hours: "7:00 AM – 9:00 PM",
    tags: ["Mess", "Daily Meals", "Veg"],
    color: tokens.accent3,
    accent: "rgba(52,211,153,.12)",
    popular: ["Paneer Masala", "Dal Rice", "Rasam"],
    rating: 3.8,
    location: "Hostel Block C",
  },
  "Mini Mart": {
    emoji: "🛒",
    hours: "8:00 AM – 10:00 PM",
    tags: ["Quick Bites", "Packaged", "Beverages"],
    color: tokens.accent4,
    accent: "rgba(251,146,60,.12)",
    popular: ["Biscuits", "Juice", "Instant Noodles"],
    rating: 3.5,
    location: "Near Main Gate",
  },
  "Juice Corner": {
    emoji: "🥤",
    hours: "9:00 AM – 7:00 PM",
    tags: ["Juices", "Shakes", "Healthy"],
    color: "#a78bfa",
    accent: "rgba(167,139,250,.12)",
    popular: ["Mango Shake", "Sugarcane Juice", "Watermelon"],
    rating: 4.3,
    location: "Sports Complex",
  },
};

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: 12, color: i <= Math.round(rating) ? "#facc15" : tokens.border2 }}>★</span>
      ))}
      <span style={{ fontSize: 11, color: tokens.muted, marginLeft: 2 }}>{rating}</span>
    </div>
  );
}

function CanteenCard({ canteen, meta, spent, visits, onSelect, isSelected }) {
  const isOpen = (() => {
    const now = new Date();
    const h = now.getHours();
    return h >= 7 && h < 21;
  })();

  const m = meta || {
    emoji: "🍽️",
    hours: "",
    tags: [],
    color: tokens.accent,
    accent: "rgba(255,255,255,0.02)",
    popular: [],
    rating: 4.0,
    location: "",
  };

  return (
    <div
      style={{
        ...s.canteenCard,
        borderColor: isSelected ? m.color : tokens.border,
        background: isSelected ? m.accent : tokens.surface,
      }}
      onClick={() => onSelect(isSelected ? null : canteen.name)}
    >
      <div style={s.cardTop}>
        <div style={{ ...s.canteenEmoji, background: m.accent }}>{m.emoji}</div>
        <div style={s.canteenInfo}>
          <div style={s.canteenName}>{canteen.name}</div>
          <div style={s.canteenLocation}>{m.location}</div>
          <StarRating rating={m.rating} />
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...s.openBadge, background: isOpen ? "rgba(52,211,153,.15)" : "rgba(248,113,113,.1)", color: isOpen ? tokens.accent3 : tokens.red, borderColor: isOpen ? "rgba(52,211,153,.3)" : "rgba(248,113,113,.25)" }}>
            {isOpen ? "● Open" : "● Closed"}
          </div>
          <div style={s.hoursText}>{m.hours}</div>
        </div>
      </div>

      <div style={s.tags}>
        {m.tags.map(t => (
          <span key={t} style={{ ...s.tag, borderColor: m.color + "44", color: m.color }}>{t}</span>
        ))}
      </div>

      {/* Spend info */}
      {spent > 0 && (
        <div style={s.spendRow}>
          <div style={s.spendStat}>
            <div style={{ ...s.spendVal, color: m.color }}>₹{spent}</div>
            <div style={s.spendLbl}>total spent</div>
          </div>
          <div style={s.spendStat}>
            <div style={{ ...s.spendVal, color: m.color }}>{visits}</div>
            <div style={s.spendLbl}>visits</div>
          </div>
          <div style={s.spendStat}>
            <div style={{ ...s.spendVal, color: m.color }}>₹{Math.round(spent / visits)}</div>
            <div style={s.spendLbl}>avg/visit</div>
          </div>
        </div>
      )}

      {/* Expanded detail */}
      {isSelected && (
        <div style={s.expanded}>
          <div style={s.expandTitle}>Popular items</div>
          {m.popular.map((item, i) => (
            <div key={i} style={s.popularItem}>
              <span style={{ fontSize: 16 }}>{"🍴"}</span>
              <span style={s.popularName}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CanteensPage({ expenses }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const canteenStats = useMemo(() => {
    const stats = {};
    CANTEENS.forEach(c => { stats[c.name] = { spent: 0, visits: 0 }; });
    expenses.forEach(e => {
      if (stats[e.canteen]) {
        stats[e.canteen].spent  += e.amount;
        stats[e.canteen].visits += 1;
      }
    });
    return stats;
  }, [expenses]);

  const topCanteen = useMemo(() => {
    const sorted = Object.entries(canteenStats).sort((a, b) => b[1].spent - a[1].spent);
    return sorted[0]?.[0];
  }, [canteenStats]);

  const filtered = CANTEENS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    CANTEEN_META[c.name]?.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const DEFAULT_META = {
    emoji: "🍽️",
    hours: "",
    tags: [],
    color: tokens.accent,
    accent: "rgba(255,255,255,0.02)",
    popular: [],
    rating: 4.0,
    location: "",
  };

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.pageTitle}>Canteens </div>
        <div style={s.pageSub}>Explore campus food spots</div>
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <span style={s.searchIcon}>🔍</span>
        <input
          style={s.searchInput}
          placeholder="Search canteens or food type…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Your fave banner */}
      {topCanteen && canteenStats[topCanteen].spent > 0 && (
        <div style={s.favBanner}>
          <span style={{ fontSize: 22 }}>❤️</span>
          <div>
            <strong style={{ color: tokens.accent2 }}>Your go-to spot</strong> is{" "}
            <strong style={{ color: tokens.text }}>{topCanteen}</strong>
            {" "}— ₹{canteenStats[topCanteen].spent} spent, {canteenStats[topCanteen].visits} visits
          </div>
        </div>
      )}

      <SectionHeader title="All Canteens" />

      {filtered.length === 0
        ? <div style={s.empty}>No canteens match "{search}"</div>
        : filtered.map(canteen => {
            const meta = CANTEEN_META[canteen.name] || DEFAULT_META;
            return (
              <div key={canteen.name} style={{ margin: "0 16px 12px" }}>
                <CanteenCard
                  canteen={canteen}
                  meta={meta}
                  spent={canteenStats[canteen.name]?.spent || 0}
                  visits={canteenStats[canteen.name]?.visits || 0}
                  onSelect={setSelected}
                  isSelected={selected === canteen.name}
                />
              </div>
            );
          })
      }

      <div style={{ height: 130 }} />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page:       { animation: "fadeIn .3s ease" },
  pageHeader: { padding: "32px 20px 4px" },
  pageTitle:  { fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 800, color: tokens.text },
  pageSub:    { fontSize: 13, color: tokens.muted, marginTop: 4 },

  searchWrap: {
    margin: "16px 16px 0", display: "flex", alignItems: "center",
    background: tokens.surface, border: `1px solid ${tokens.border2}`,
    borderRadius: 14, padding: "10px 14px", gap: 10,
  },
  searchIcon:  { fontSize: 16 },
  searchInput: {
    flex: 1, background: "none", border: "none", outline: "none",
    fontSize: 14, color: tokens.text, fontFamily: tokens.fontSans,
  },

  favBanner: {
    margin: "12px 16px 0", background: "linear-gradient(135deg,rgba(244,114,182,.1),rgba(192,132,252,.08))",
    border: "1px solid rgba(244,114,182,.22)", borderRadius: 14, padding: "12px 16px",
    display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: tokens.text,
  },

  canteenCard: {
    background: tokens.surface, border: `1px solid ${tokens.border}`,
    borderRadius: 18, padding: 16, cursor: "pointer", transition: "all .2s",
  },
  cardTop:    { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  canteenEmoji: {
    width: 48, height: 48, borderRadius: 12, display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0,
  },
  canteenInfo:    { flex: 1, minWidth: 0 },
  canteenName:    { fontWeight: 700, fontSize: 15, color: tokens.text, marginBottom: 2 },
  canteenLocation:{ fontSize: 11, color: tokens.muted, marginBottom: 4 },
  openBadge: {
    fontSize: 10, fontWeight: 600, border: "1px solid", borderRadius: 20,
    padding: "2px 8px", marginBottom: 4, display: "inline-block",
  },
  hoursText: { fontSize: 10, color: tokens.muted },
  tags:      { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
  tag:       { fontSize: 11, border: "1px solid", borderRadius: 20, padding: "2px 8px" },

  spendRow:  { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8, borderTop: `1px solid ${tokens.border}`, paddingTop: 12 },
  spendStat: { textAlign: "center" },
  spendVal:  { fontFamily: tokens.fontDisplay, fontSize: 16, fontWeight: 700 },
  spendLbl:  { fontSize: 10, color: tokens.muted, marginTop: 2 },

  expanded:     { marginTop: 14, paddingTop: 14, borderTop: `1px solid ${tokens.border}` },
  expandTitle:  { fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: tokens.muted, marginBottom: 10 },
  popularItem:  { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  popularName:  { fontSize: 13, color: tokens.text },

  empty: { textAlign: "center", padding: "40px 20px", color: tokens.muted, fontSize: 14 },
};
