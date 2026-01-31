import { NextResponse } from "next/server";
import { deleteExpense } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const success = deleteExpense(id);
  
  if (!success) {
    return NextResponse.json(
      { error: "Expense not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
