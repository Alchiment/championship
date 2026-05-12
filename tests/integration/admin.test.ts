import { describe, it, expect } from "vitest";

describe("Admin routes (unauthenticated)", () => {
  it("GET /admin returns 401 without auth", async () => {
    const response = await fetch("http://localhost:3000/admin");
    expect(response.status).toBe(401);
  });

  it("GET /admin/teams returns 401 without auth", async () => {
    const response = await fetch("http://localhost:3000/admin/teams");
    expect(response.status).toBe(401);
  });

  it("POST /api/teams returns 401 without auth", async () => {
    const response = await fetch("http://localhost:3000/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", code: "TST", flag: "🏳️" }),
    });
    expect(response.status).toBe(401);
  });
});
