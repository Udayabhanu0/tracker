"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import type { Expense } from "@/lib/db";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Transportation: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Utilities: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  Entertainment: "bg-pink-100 text-pink-800 hover:bg-pink-100",
  Health: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  Shopping: "bg-violet-100 text-violet-800 hover:bg-violet-100",
  Other: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No expenses found</p>
          <p className="text-sm text-muted-foreground">
            Add your first expense to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">
                  {expense.description}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other}
                  >
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(expense.date)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatAmount(expense.amount)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(expense.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete expense</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
