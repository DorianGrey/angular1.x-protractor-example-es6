'use strict';

import {HeaderComponent} from '../objects/header.component';

describe('A simple header testcase', function () {
  beforeAll(() => {
    browser.get('/');
    this.header = new HeaderComponent();
  });

  it('should be able to interact with the quick-link drop-down correctly', () => {
    // Testing a custom dropdown regularly works like illustrated in the steps below.
    // Unfortunately, some implementations do not work that well while being automatically tested.
    // E.g., in some cases and browsers, the test-runner causes two clicks to happen instead of one as requested.
    // The bootstrap implementation used in this example appears to be rather stable against this behavior.
    this.header.quickLinks.dropdown.click();

    since('There should be three entries within the drop-down').expect(this.header.quickLinks.options.count()).toEqual(3);

    this.header.quickLinks.options.each((element, idx) => {
      since(`Element #${idx} should be displayed`).expect(element.isDisplayed()).toBeTruthy();
    });

    this.header.quickLinks.dropdown.click();
  });
});