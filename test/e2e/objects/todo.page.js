'use strict';

export class TodoPage {
  constructor() {
    this.root = element(by.id('todo-page'));

    this.todoEntries = this.root.all(by.className('list-group-item'));
    this.todoEntries.descriptions = this.todoEntries.all(by.binding('todo.description'));
    this.todoEntries.priorities = this.todoEntries.all(by.className('todo-priority'));
    this.todoEntries.mostRecentEntry = this.todoEntries.last().element(by.binding('todo.description'));
    this.todoEntries.removeIcons = this.todoEntries.all(by.className('remove-item'));

    this.newTodo = {
      textarea: this.root.element(by.tagName('textarea')),
      datepicker: this.root.element(by.tagName('datepicker')),
      submitButton: this.root.element(by.id('create-task-button')),
      prioritySelection: this.root.element(by.id('task-priority-input'))
    };
    this.newTodo.datepicker.inputElem = this.newTodo.datepicker.element(by.id('task-until-input'));
    this.newTodo.datepicker.todayEntry = this
      .newTodo
      .datepicker
      .all(by.className('_720kb-datepicker-active'))
      .filter((elem) => elem.getAttribute('ng-click').then((attr) => {
        return /datepickerDay/i.test(attr);
      }));

    this.newTodo.prioritySelection.options = this.newTodo.prioritySelection.all(by.tagName('option'));

    this.calcResultOf = (function () {
      let opcalcs = {
        '+': function (left, right) {
          return left + right;
        },
        '-': function (left, right) {
          return left - right;
        },
        '*': function (left, right) {
          return left * right;
        },
        '/': function (left, right) {
          return left / right;
        }
      };
      return function (left, op, right) {
        return parseInt(opcalcs[op](left, right));
      }
    })();
  }

  createTodoForToday(withDescription, priorityIdx = 0) {
    this.newTodo.datepicker.inputElem.click();
    this.newTodo.datepicker.todayEntry.first().click();
    this.newTodo.textarea.sendKeys(withDescription);
    this.newTodo.prioritySelection.options.get(priorityIdx).click();
    this.newTodo.submitButton.click();
  }
}