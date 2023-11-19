# playwrightIssueWithHARMocking

This was created to reproduce the issue mentioned in https://github.com/microsoft/playwright/issues/28167

To use this project:

1. Clone repository
2. Run `npm install` to install dependencies
3. Run `npm playwright install` to install browsers

To reproduce mocking issue:

1. Set `update: true` in `page.routeFromHAR()` (note: I believe you will need to do this instead of using the committed files because Atlassian revoked the API token that was stored in the HAR file when they detected that it was in a public repo)
2. Run test "Add a card" in `trello.spec.ts` to record new HAR file
3. Set `update: false` in `page.routeFromHAR()` so the test will run against the new HAR file
4. Run test "Add a card" again

**Expected behavior**: Test should pass without actually saving the Trello card (use case: this is a UI test that is trying to validate what happens in the UI when a card is created)

**Actual behavior**: The card does not get created and the test fails
