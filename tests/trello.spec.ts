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

    // Assert the card doesn't already exist in the "Doing" column for the mocked test
    const cardText = `Playwright is awesome! ${test.info().project.name} ${randomNumber}`;
    const doingColumn = page.getByTestId("list").filter({ hasText: "Doing" });

    // Add a card
    await doingColumn.getByRole("button", { name: "Add a card" }).click();
    console.log(`card name for this run: ${cardText}`)
    await page.getByPlaceholder("Enter a title for this card").fill(cardText);
    await page.getByPlaceholder("Enter a title for this card").press("Enter");

    // Assert new card was added
    const cardsInDoingColumn = doingColumn.getByTestId("list-card");
    await expect(doingColumn.getByPlaceholder("Enter a title for this card")).toBeEmpty();
    await expect(cardsInDoingColumn.getByText(cardText)).toBeVisible();
  });
}
