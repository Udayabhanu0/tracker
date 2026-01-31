import { ExpenseTracker } from "@/components/expense-tracker";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
          <p className="mt-2 text-muted-foreground">
            Track your spending and get AI-powered insights
          </p>
        </header>
        <ExpenseTracker />
      </div>
    </main>
  );
}
