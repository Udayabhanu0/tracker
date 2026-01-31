export async function POST(request: Request) {
  try {
    const { expenses, categoryTotals } = await request.json();

    if (!expenses || expenses.length === 0) {
      return Response.json({
        insights: "Add some expenses to get insights about your spending habits.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

    if (!apiKey) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const totalSpent = categoryTotals.reduce(
      (sum: number, cat: { total: number }) => sum + cat.total,
      0
    );
    const avgExpense = totalSpent > 0 ? totalSpent / expenses.length : 0;
    const sortedCategories = [...categoryTotals].sort(
      (a: { total: number }, b: { total: number }) => b.total - a.total
    );
    const topCategory = sortedCategories[0];

    const prompt = `You are a personal finance assistant. Provide 3-5 concise insights and practical tips based on the user's expense summary. Use short paragraphs or bullet points.\n\nExpense summary:\n- Total spent: $${totalSpent.toFixed(2)}\n- Number of expenses: ${expenses.length}\n- Average expense: $${avgExpense.toFixed(2)}\n- Top category: ${topCategory ? `${topCategory.category} ($${topCategory.total.toFixed(2)})` : "N/A"}\n- Category totals: ${sortedCategories
      .map((cat) => `${cat.category}=$${cat.total.toFixed(2)}`)
      .join(", ")}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    const insightsText = geminiData?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("")
      .trim();

    if (!insightsText) {
      throw new Error("Empty Gemini response");
    }

    return Response.json({ insights: insightsText });
  } catch (error) {
    console.error("Insights error:", error);
    return Response.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
