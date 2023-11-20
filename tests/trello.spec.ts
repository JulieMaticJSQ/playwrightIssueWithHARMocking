import { test, expect } from '@playwright/test';

const randomNumber = Math.floor(Math.random()*90000) + 10000;

test.afterEach(async ({ page }) => {
  await page.context().close();
});

const testDetails = [ { update: true, title: "update HAR file" }, { update: false, title: "with mocking" } ];
for (const details of testDetails) {
  test(`Add a card - ${details.title}`, async ({ page }) => {
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
    await page.routeFromHAR(`mocks/${test.info().project.name}/trello.har`, { url: /.*(\/cards|\/batch)/, update: details.update });

    // Get the number of cards in the "Doing" column to compare against later
    const cardText = `Playwright is awesome! ${test.info().project.name} ${randomNumber}`;
    const doingColumn = page.getByTestId("list").filter({ hasText: "Doing" });
    const cardsInDoingColumn = doingColumn.getByTestId("list-card");
    await expect(cardsInDoingColumn.getByText("Dummy card")).toBeVisible();
    const cardCount = await cardsInDoingColumn.count();

    // Add a card
    await doingColumn.getByRole("button", { name: "Add a card" }).click();
    console.log(`card name for this run: ${cardText}`)

    const cardComposer = doingColumn.getByPlaceholder("Enter a title for this card");
    await cardComposer.fill(cardText);
    await cardComposer.press("Enter");

    // Assert new card was added
    await expect(cardsInDoingColumn).toHaveCount(cardCount + 1);
    await expect(cardsInDoingColumn.getByText(cardText)).toBeVisible();
  });
}
