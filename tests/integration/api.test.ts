import { describe, it, expect } from "vitest";

describe("API routes", () => {
  it("GET /api/teams returns an array", async () => {
    const response = await fetch("http://localhost:3000/api/teams");
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("GET /api/matches returns an array", async () => {
    const response = await fetch("http://localhost:3000/api/matches");
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("GET /api/standings returns an array", async () => {
    const response = await fetch("http://localhost:3000/api/standings");
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
