'use strict';

import {HomePage} from '../objects/home.page';

describe('A simple initial testcase', function () {

  beforeAll(() => {
    browser.get("/");
    this.homePage = new HomePage();
  });

  it('should display the home`s root element correctly', () => {
    since('The home page\'s title should be displayed').expect(this.homePage.title.isDisplayed()).toBeTruthy();
  });

});