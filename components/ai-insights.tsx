"use client";

import { Spinner } from "@/components/ui/spinner"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import type { Expense } from "@/lib/db";

interface AIInsightsProps {
  expenses: Expense[];
  categoryTotals: { category: string; total: number }[];
}

export function AIInsights({ expenses, categoryTotals }: AIInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses, categoryTotals }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate insights");
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch {
      setError("Failed to generate insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-amber-500" />
          AI Insights
        </CardTitle>
        {insights && (
          <Button
            variant="ghost"
            size="icon"
            onClick={generateInsights}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh insights</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!insights && !isLoading && !error && (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-center text-sm text-muted-foreground">
              Get AI-powered analysis of your spending habits
            </p>
            <Button onClick={generateInsights} disabled={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Insights
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            <p className="text-sm text-muted-foreground">Analyzing your expenses...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" onClick={generateInsights}>
              Try Again
            </Button>
          </div>
        )}

        {insights && !isLoading && (
          <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground">
            {insights.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
