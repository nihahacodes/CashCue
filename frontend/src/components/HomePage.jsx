import Header        from "./Header";
import BudgetCard     from "./BudgetCard";
import StatsRow       from "./StatsRow";
import InsightBanner  from "./InsightBanner";
import SectionHeader  from "./SectionHeader";
import DonutChart     from "./DonutChart";
import Heatmap        from "./Heatmap";
import ExpenseFeed    from "./ExpenseFeed";

export default function HomePage({
  expenses,
  budget,
  monthSpent,
  todaySpent,
  dailyAvg,
  catTotals,
  streak,
  onDelete,
  onEditBudget,
}) {
  return (
    <>
      <Header streak={streak} />

      <BudgetCard
        monthSpent={monthSpent}
        budget={budget}
        onEditBudget={onEditBudget}
      />

      <StatsRow
        todaySpent={todaySpent}
        dailyAvg={dailyAvg}
        mealCount={expenses.length}
      />

      <InsightBanner expenses={expenses} budget={budget} />

      <SectionHeader title="Spending Breakdown" />
      <DonutChart catTotals={catTotals} />

      <SectionHeader title="This Month" />
      <Heatmap expenses={expenses} />

      <SectionHeader title="Recent Bites 🧾" />
      <ExpenseFeed expenses={expenses} onDelete={onDelete} />

      <div style={{ height: 130 }} />
    </>
  );
}
