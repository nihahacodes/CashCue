export const CATEGORIES = [
  { name: "Breakfast", emoji: "☀️", color: "#facc15", bg: "rgba(250,204,21,.13)" },
  { name: "Lunch",     emoji: "🌤️", color: "#60a5fa", bg: "rgba(96,165,250,.13)" },
  { name: "Snacks",    emoji: "🍿", color: "#f472b6", bg: "rgba(244,114,182,.13)" },
  { name: "Dinner",    emoji: "🌙", color: "#c084fc", bg: "rgba(192,132,252,.13)" },
];

export const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.name, c]));

export const CANTEENS = [
  { name: "Krishna Canteen", sub: " Open Now" },
  { name: "Southern",  sub: " Popular" },
  { name: "Vela Cafe",   sub: "Open Now" },
  { name: "The Chat Khazaana",  sub: "Open Now" },
  { name: "Cream And Creamy",    sub: "Quick bites" },
  { name: "Green Cafe", sub: "Snack Now !" },
];



export const NAV_ITEMS = [
  { id: "home",    icon: "🏠", label: "Home" },
  { id: "stats",   icon: "📊", label: "Insights" },
  { id: "campus",  icon: "🏫", label: "Canteens" },
  { id: "profile", icon: "👤", label: "Profile" },
];
 
