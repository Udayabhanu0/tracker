import { NextResponse } from "next/server";
import {
  getAllExpenses,
  getExpensesByCategory,
  createExpense,
  getGrandTotal,
  getTotalByCategory,
  getCategories,
} from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const expenses = category && category !== "all" 
    ? getExpensesByCategory(category) 
    : getAllExpenses();
  
  const total = getGrandTotal();
  const categoryTotals = getTotalByCategory();
  const categories = getCategories();

  return NextResponse.json({
    expenses,
    total,
    categoryTotals,
    categories,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { description, amount, category, date } = body;
    
    if (!description || !amount || !category || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const expense = createExpense({
      description,
      amount: Number(amount),
      category,
      date,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
