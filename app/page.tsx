"use client";

import { useState } from "react";

type Recipe = {
  name: string;
  usesIngredients: string[];
  missingIngredients: string[];
  steps: string[];
};

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRecipes([]);

    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setRecipes(data.recipes || []);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pantry AI Planner
        </h1>
        <p className="text-gray-600 mb-6">
          Tell us what&apos;s in your pantry, and get recipe ideas instantly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="ingredients" className="block font-medium text-gray-800">
            Your ingredients
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g. chicken, rice, tomato, onion"
            className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-black"
            aria-describedby="ingredients-hint"
          />
          <p id="ingredients-hint" className="text-sm text-gray-500">
            Separate items with commas.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Finding recipes..." : "Get Recipes"}
          </button>
        </form>

        {error && (
          <div role="alert" className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {recipes.length > 0 && (
          <div className="mt-8 space-y-6">
            {recipes.map((recipe, i) => (
              <article
                key={i}
                className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {recipe.name}
                </h2>

                {recipe.usesIngredients?.length > 0 && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Uses:</span>{" "}
                    {recipe.usesIngredients.join(", ")}
                  </p>
                )}

                {recipe.missingIngredients?.length > 0 && (
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">You may also need:</span>{" "}
                    {recipe.missingIngredients.join(", ")}
                  </p>
                )}

                <ol className="list-decimal list-inside space-y-1 text-gray-800">
                  {recipe.steps?.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}