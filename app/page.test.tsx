import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

describe("Home page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the heading, ingredients input, and submit button", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /pantry ai planner/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/your ingredients/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /get recipes/i })
    ).toBeInTheDocument();
  });

  it("shows a validation error when submitting with empty ingredients", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const submitButton = screen.getByRole("button", { name: /get recipes/i });
    await user.click(submitButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/please enter at least one ingredient/i);
  });

  it("renders recipes returned from the API after a successful submission", async () => {
    const mockRecipes = {
      recipes: [
        {
          name: "Simple Chicken Fried Rice",
          usesIngredients: ["chicken", "rice"],
          missingIngredients: ["soy sauce"],
          steps: ["Cook rice.", "Cook chicken.", "Combine and serve."],
        },
      ],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockRecipes,
      })
    );

    const user = userEvent.setup();
    render(<Home />);

    const textarea = screen.getByLabelText(/your ingredients/i);
    await user.type(textarea, "chicken, rice");

    const submitButton = screen.getByRole("button", { name: /get recipes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /simple chicken fried rice/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/cook rice\./i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/recipes",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ ingredients: "chicken, rice" }),
      })
    );
  });
});
