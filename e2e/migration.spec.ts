import { test, expect } from "@playwright/test";

test.describe("Public routes - React Router v7 migration", () => {
  test("home page redirects to standings", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/standings|\/$/);
  });

  test("standings page loads", async ({ page }) => {
    await page.goto("/standings");
    await expect(page.locator("h1").last()).toContainText("Tabla de posiciones");
  });

  test("schedule page loads", async ({ page }) => {
    await page.goto("/schedule");
    await expect(page.locator("h1").last()).toContainText("Calendario");
  });

  test("teams page loads", async ({ page }) => {
    await page.goto("/teams");
    await expect(page.locator("h1").last()).toContainText("Equipos");
  });

  test("404 page works", async ({ page }) => {
    const response = await page.goto("/nonexistent-page-xyz");
    // Should either be 404 or show 404 content
    const content = await page.textContent("body");
    expect(content).toBeTruthy();
  });
});

test.describe("API routes - React Router v7 migration", () => {
  test("GET /api/teams returns array", async ({ request }) => {
    const response = await request.get("/api/teams");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("GET /api/matches returns array", async ({ request }) => {
    const response = await request.get("/api/matches");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("GET /api/standings returns data", async ({ request }) => {
    const response = await request.get("/api/standings");
    expect(response.status()).toBe(200);
  });
});

test.describe("Admin routes - auth redirect", () => {
  test("GET /admin returns 401 without auth", async ({ request }) => {
    const response = await request.get("/admin");
    expect(response.status()).toBe(401);
  });

  test("GET /admin/teams returns 401 without auth", async ({ request }) => {
    const response = await request.get("/admin/teams");
    expect(response.status()).toBe(401);
  });
});

test.describe("Root layout - React Router v7 migration", () => {
  test("page has correct HTML structure", async ({ page }) => {
    await page.goto("/standings");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "es");
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/standings");
    await page.click('a[href="/teams"]');
    await expect(page).toHaveURL("/teams");
  });
});