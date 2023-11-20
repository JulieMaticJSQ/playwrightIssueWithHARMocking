# playwrightIssueWithHARMocking

This was created to reproduce the issue mentioned in https://github.com/microsoft/playwright/issues/28167

To use this project:

1. Clone repository
2. Run `npm install` to install dependencies
3. Run `npm playwright install` to install browsers

To reproduce mocking issue:

Run the tests in trello.spec.ts

**Expected behavior**: Test "Add a card - update HAR file" should pass and create a HAR file with all of the needed network activity. Test "Add a card - with mocking" should run against the HAR file that was created and pass without actually saving the Trello card (use case: this is a UI test that is trying to validate what happens in the UI when a card is created)

**Actual behavior**: Test "Add a card - with mocking" fails because because the card does not get created (the text is typed but after pressing Enter, the card isn't added to the list)
