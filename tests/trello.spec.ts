import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }) => {
  await page.context().close();
});

test('Add a card', async ({ page }) => {
  // Log in to Trello
  await page.goto('https://trello.com/b/eAUqLIxb/test');
  await page.getByRole("button", { name: "Log in"}).click();

  // Email
  await page.getByPlaceholder("email").fill("julierenee42+trello@gmail.com");
  await page.getByRole("button", { name: "Continue" }).click();

  // Password
  await page.getByPlaceholder("password").fill("!qhe-&&!P7s.a@H");
  await page.getByRole("button", { name: "Log in" }).click();

  // Start mocking
  await page.routeFromHAR("mocks/trello.har", { url: /.*(\/cards|\/batch)/, update: false });

  // Assert there are no cards in the "Doing" column
  const doingColumn = page.getByTestId("list").filter({ hasText: "Doing" });
  const cardsInDoingColumn = doingColumn.getByTestId("list-card");
  await expect(cardsInDoingColumn).toHaveCount(0);

  // Add a card
  await doingColumn.getByRole("button", { name: "Add a card" }).click();
  await page.getByPlaceholder("Enter a title for this card").fill("Playwright is awesome!");
  await page.getByPlaceholder("Enter a title for this card").press("Enter");

  // Assert new card was added
  await expect(cardsInDoingColumn).toHaveCount(1);
  await expect(cardsInDoingColumn.getByText("Playwright is awesome!")).toBeVisible();
});
