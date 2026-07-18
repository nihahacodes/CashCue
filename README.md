# CashCue 

> A smart campus food expense tracker built for college students — log canteen spending, visualize patterns, and actually stay on budget.

## ✨ Features

### 🏠 Home
- **Live budget tracker** — monthly progress bar that shifts green → yellow → red as you spend
- **Quick stats** — today's spend, daily average, and total meal count at a glance
- **Smart insight banner** — context-aware tips that change based on your spending behaviour
- **Donut chart** — real-time category breakdown drawn on native Canvas (no Chart.js)
- **28-day heatmap** — GitHub-style spending grid with intensity levels
- **Expense feed** — grouped by date with time-ago labels, category color coding, and swipe-to-delete

### 📊 Insights
- 7-day vertical bar chart with today highlighted
- 5-month spending trend chart
- Category breakdown with animated progress bars
- Top 5 favourite dishes with medal rankings
- Per-canteen spending breakdown

### 🏫 Canteens
- Full directory of campus canteens with open/closed status
- Search by name or food type 
- Tap to expand — see popular dishes, hours, location, and star rating
- "Your go-to spot" banner based on actual spending data
- Per-canteen stats pulled live from your expense history (total spent, visits, avg/visit)

### 👤 Profile
- Google sign-in — name and profile photo pulled automatically
- 8 unlockable achievement badges (streak, variety, budget hero, canteen hopper…)
- Editable name and college fields persisted in localStorage
- Lifetime stats grid
- Settings toggles (reminders, weekly report, dark mode)
- Sign out with one tap

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Bundler | Vite 5 |
| Auth | Firebase Authentication (Google OAuth) |
| Charts | Native Canvas API (no libraries) |
| Styling | Inline JS style objects + CSS variables |
| Storage | localStorage (client-side persistence) |
| Fonts | Space Grotesk + Syne (Google Fonts) |

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root — auth gate + page router
├── firebase.js                # Firebase app init + Google provider
├── main.jsx                   # React DOM entry point
│
├── constants/
│   └── index.js               # CATEGORIES, CANTEENS, DEMO_EXPENSES, NAV_ITEMS
│
├── styles/
│   └── index.js               # Design tokens + global CSS keyframes
│
├── utils/
│   └── index.js               # timeAgo, dayKey, calcStreak, groupExpenses…
│
├── hooks/
│   ├── useAuth.js             # Firebase auth state, signIn, signOut
│   ├── useExpenses.js         # Expense CRUD + localStorage persistence
│   └── useToast.js            # Toast notification state
│
└── components/
    ├── LoginPage.jsx           # Google sign-in splash screen
    ├── HomePage.jsx            # Home tab layout
    ├── InsightsPage.jsx        # Analytics + charts page
    ├── CanteensPage.jsx        # Canteen directory page
    ├── ProfilePage.jsx         # User profile + achievements page
    │
    ├── Header.jsx              # App header with streak badge
    ├── BudgetCard.jsx          # Monthly budget hero card
    ├── StatsRow.jsx            # Today / avg / count stat cards
    ├── InsightBanner.jsx       # Contextual smart tip banner
    ├── DonutChart.jsx          # Canvas donut + legend
    ├── Heatmap.jsx             # 28-day spending heatmap grid
    ├── ExpenseFeed.jsx         # Filter tabs + grouped expense list
    ├── ExpenseRow.jsx          # Individual expense list item
    ├── AddExpenseModal.jsx     # Bottom-sheet add expense form
    ├── SectionHeader.jsx       # Reusable section title
    ├── BottomNav.jsx           # Fixed bottom navigation bar
    ├── Toast.jsx               # Slide-in notification
    └── AmbientBackground.jsx  # Decorative glow blobs
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Google Authentication enabled

### 1. Clone the repo
```bash
git clone https://github.com/your-username/cashcue.git
cd cashcue
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project → **Authentication** → **Sign-in method** → enable **Google**
3. Register a web app and copy your config object

### 4. Add your Firebase config

Open `src/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "your-api-key",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId:             "your-app-id",
};
```

### 5. Run the app
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — sign in with Google and start logging meals!

---

## 🏗 Build for Production

```bash
npm run build
```

Output is in the `dist/` folder — deploy to Vercel, Netlify, or Firebase Hosting.

**Deploy to Vercel in one command:**
```bash
npx vercel --prod
```

> After deploying, add your production domain to **Firebase Console → Authentication → Settings → Authorized domains**.

---

## 🎨 Design System

CashCue uses a custom design token system defined in `src/styles/index.js`:

```js
tokens.bg        // #0a0a0f  — page background
tokens.surface   // #12121a  — card background
tokens.accent    // #c084fc  — primary purple
tokens.accent2   // #f472b6  — pink gradient pair
tokens.accent3   // #34d399  — success green
tokens.muted     // #8884a8  — secondary text
tokens.fontDisplay // 'Syne' — headings
tokens.fontSans    // 'Space Grotesk' — body
```

All components consume these tokens directly — no Tailwind, no CSS modules, no external UI library.

---

## 🏆 Achievements System

CashCue includes 8 unlockable badges based on real usage:

| Badge | Condition |
|-------|-----------|
| 🍴 First Bite | Log your first meal |
| 🔥 On Fire | 3-day logging streak |
| ⚡ Week Warrior | 7-day logging streak |
| 🍽️ Regular | Log 10 meals |
| 💰 Budget Hero | Stay under budget for the month |
| 🌈 Foodie | Try all 4 meal categories |
| 🏃 Canteen Hopper | Visit 4+ different canteens |
| 💯 Century | Spend over ₹100 in a single day |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © [Niharika E](https://github.com/nihahacodes)

---

<div align="center">
  Built with ❤️ for campus 
  <br/>
  <strong>CashCue</strong> — know where every rupee went 🍜
</div>
