'use strict';

describe('A simple initial testcase', () => {

  beforeEach(() => {
    browser.get("/");
  });

  it('should display the home`s root element correctly', () => {
    let elem = element(by.id('home-app-name-title'));
    expect(elem.isDisplayed()).toBeTruthy();
  });

});