'use strict';

export class TodoPage {
  constructor() {
    this.root = element(by.id('todo-page'));

    this.todoEntries = this.root.all(by.className('list-group-item'));
    this.todoEntries.descriptions = this.todoEntries.all(by.binding('todo.description'));
    this.todoEntries.mostRecentEntry = this.todoEntries.last().element(by.binding('todo.description'));
    this.todoEntries.removeIcons = this.todoEntries.all(by.className('remove-item'));

    this.newTodo = {
      textarea: this.root.element(by.tagName('textarea')),
      datepicker: this.root.element(by.tagName('datepicker')),
      submitButton: this.root.element(by.id('create-task-button'))
    };
    this.newTodo.datepicker.inputElem = this.newTodo.datepicker.element(by.id('task-until-input'));
    this.newTodo.datepicker.todayEntry = this
      .newTodo
      .datepicker
      .all(by.className('_720kb-datepicker-active'))
      .filter((elem) => elem.getAttribute('ng-click').then((attr) => {
        return /datepickerDay/i.test(attr);
      }));
  }
}