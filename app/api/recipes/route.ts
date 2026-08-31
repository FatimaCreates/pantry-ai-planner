import { NextRequest, NextResponse } from "next/server";

const MOCK_RECIPES = {
  recipes: [
    {
      name: "Simple Chicken Fried Rice",
      usesIngredients: ["chicken", "rice"],
      missingIngredients: ["soy sauce", "egg", "spring onion"],
      steps: [
        "Cook rice and let it cool slightly.",
        "Cut chicken into small pieces and cook until golden.",
        "Add rice to the pan and stir-fry for 3-4 minutes.",
        "Season with soy sauce and serve hot.",
      ],
    },
    {
      name: "One-Pot Chicken Rice",
      usesIngredients: ["chicken", "rice"],
      missingIngredients: ["onion", "garlic", "stock"],
      steps: [
        "Sauté onion and garlic until fragrant.",
        "Add chicken pieces and sear on all sides.",
        "Add rice and stock, bring to a boil.",
        "Cover and simmer on low heat for 18-20 minutes.",
      ],
    },
    {
      name: "Chicken & Rice Soup",
      usesIngredients: ["chicken", "rice"],
      missingIngredients: ["carrot", "celery", "stock"],
      steps: [
        "Boil chicken in stock until cooked through, then shred.",
        "Add rice and diced vegetables to the pot.",
        "Simmer for 15 minutes until rice is tender.",
        "Season to taste and serve warm.",
      ],
    },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients || typeof ingredients !== "string" || !ingredients.trim()) {
      return NextResponse.json(
        { error: "Please provide at least one ingredient." },
        { status: 400 }
      );
    }

    // Mock mode: return sample data without calling the real API.
    // Flip USE_MOCK_DATA to "false" in .env.local once billing/credits are set up.
    if (process.env.USE_MOCK_DATA === "true") {
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulate loading
      return NextResponse.json(MOCK_RECIPES);
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY as string,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        messages: [
          {
            role: "user",
            content: `You are a helpful cooking assistant. Based on these pantry ingredients: "${ingredients}", suggest 3 realistic recipes.

Respond ONLY with valid JSON, no preamble, no markdown fences, in this exact shape:
{
  "recipes": [
    {
      "name": "string",
      "usesIngredients": ["string"],
      "missingIngredients": ["string"],
      "steps": ["string"]
    }
  ]
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json(
        { error: "Failed to get recipe suggestions. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text ?? "";

    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Claude response:", rawText);
      return NextResponse.json(
        { error: "Got an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Something went wrong on our end." },
      { status: 500 }
    );
  }
}