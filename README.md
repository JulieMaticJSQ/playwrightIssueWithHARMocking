# playwrightIssueWithHARMocking

This was created to reproduce the issue mentioned in https://github.com/microsoft/playwright/issues/28167

To use this project:

1. Clone repository
2. Run `npm install` to install dependencies
3. Run `npm playwright install` to install browsers

To reproduce mocking issue:

1. Run test "Add a card" in trello.spec.ts

- Note: HAR file has already been recorded so `update` is set to `false` in `page.routeFromHAR()`

2. Expected behavior: Test should pass without actually saving the Trello card (use case: this is a UI test that is trying to validate what happens in the UI when a card is created)
3. Actual behavior: The card does not get created and the test fails
