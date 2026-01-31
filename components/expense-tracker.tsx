"use client";

import { useState, useEffect } from "react";
import { ExpenseForm } from "./expense-form";
import { ExpenseList } from "./expense-list";
import { ExpenseSummary } from "./expense-summary";
import { CategoryFilter } from "./category-filter";
import { AIInsights } from "./ai-insights";
import { Loader2 } from "lucide-react";
import type { Expense } from "@/lib/db";

interface ExpenseData {
  expenses: Expense[];
  total: number;
  categoryTotals: { category: string; total: number }[];
  categories: string[];
}

export function ExpenseTracker() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [data, setData] = useState<ExpenseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/expenses?category=${selectedCategory}`);
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory]);

  const handleExpenseAdded = () => {
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-destructive">Failed to load expenses</p>
      </div>
    );
  }

  const { expenses = [], total = 0, categoryTotals = [], categories = [] } = data || {};

  return (
    <div className="flex flex-col gap-8">
      <ExpenseSummary total={total} categoryTotals={categoryTotals} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Expenses</h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          <ExpenseList expenses={expenses} onDelete={handleDelete} />
        </div>

        <div className="flex flex-col gap-6">
          <ExpenseForm onExpenseAdded={handleExpenseAdded} />
          <AIInsights expenses={expenses} categoryTotals={categoryTotals} />
        </div>
      </div>
    </div>
  );
}
