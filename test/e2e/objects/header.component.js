'use strict';

export class HeaderComponent {
  constructor() {
    // `$` is a short-hander for `element(by.css(...))`.
    // `$$` would be the equivalent for `element.all(by.css(...))`
    this.todoPageRef = $('a[ui-sref="todo"]');
  }
}