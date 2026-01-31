"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

interface ExpenseSummaryProps {
  total: number;
  categoryTotals: { category: string; total: number }[];
}

export function ExpenseSummary({ total, categoryTotals }: ExpenseSummaryProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatAmount(total)}</div>
          <p className="text-xs text-muted-foreground">
            Across {categoryTotals.length} categories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {categoryTotals.length > 0 ? (
            <>
              <div className="text-2xl font-bold">{categoryTotals[0].category}</div>
              <p className="text-xs text-muted-foreground">
                {formatAmount(categoryTotals[0].total)} spent
              </p>
            </>
          ) : (
            <div className="text-muted-foreground">No data yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
