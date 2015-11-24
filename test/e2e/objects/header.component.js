'use strict';

export class HeaderComponent {
  constructor() {
    // `$` is a short-hander for `element(by.css(...))`.
    // `$$` would be the equivalent for `element.all(by.css(...))`
    this.todoPageRef = $('.navbar-nav a[ui-sref="todo"]');

    this.quickLinks = {
      dropdown: element(by.id('dropdownMenu1')),
      options: $$('[aria-labelledby="dropdownMenu1"] > li')
    };
  }
}