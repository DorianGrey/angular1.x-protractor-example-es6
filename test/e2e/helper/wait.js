let EC = protractor.ExpectedConditions,
  defaultTimeout = 20000;

export default {

  presence: function (elem, timeout = defaultTimeout) {
    return browser.wait(EC.presenceOf(elem), timeout);
  },

  absence: function (elem, timeout = defaultTimeout) {
    return browser.wait(EC.stalenessOf(elem), timeout);
  },

  visible: function (elem, timeout = defaultTimeout) {
    return browser.wait(EC.visibilityOf(elem), timeout);
  },

  invisible: function (elem, timeout = defaultTimeout) {
    return browser.wait(EC.invisibilityOf(elem), timeout);
  }

}



