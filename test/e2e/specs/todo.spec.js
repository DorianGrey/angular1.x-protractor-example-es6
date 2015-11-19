'use strict';

describe('A more complex test for the "TODO list" page', () => {

  beforeAll(() => {
    browser.get("/");
  });

  describe('General layout', () => {

    it('should correctly move to the "TODO list" page', () => {
      // `$` is a short-hander for `element(by.css(...))`.
      // `$$` would be the equivalent for `element.all(by.css(...))`
      let headerButton = $('a[ui-sref="todo"]'),
        todoPageRoot = element(by.id('todo-page'));

      headerButton.click();
      expect(todoPageRoot.isDisplayed()).toBeTruthy();
    });

    it('should correctly list two example tasks', () => {
      let todoEntries = element.all(by.className('list-group-item'));

      expect(todoEntries.count()).toEqual(2)
    });

    it('should display tasks with descriptions "First task" and "Second task"', () => {
      let taskNames = element.all(by.binding('todo.description'));

      expect(taskNames.first().getText()).toEqual("First task");
      expect(taskNames.last().getText()).toEqual("Second task");
    });

    it('should correctly display entries to create a new task: A textarea, a datepicker, and a button to submit the task', () => {
      let textarea = element(by.tagName('textarea')),
        datepicker = element(by.tagName('datepicker')),
        submitButton = element(by.id('create-task-button'));

      expect(textarea.isDisplayed()).toBeTruthy();
      expect(datepicker.isDisplayed()).toBeTruthy();
      expect(submitButton.isDisplayed()).toBeTruthy();
    });

    it('should not be possible to submit a task without entering some text', () => {
      let submitButton = element(by.id('create-task-button'));

      expect(submitButton.getAttribute('aria-disabled')).toBeTruthy();
    });

    it('should highlight the textarea as invalid, since it is empty by default', () => {
      let textarea = element(by.tagName('textarea'));

      expect(textarea.getAttribute('aria-invalid')).toBeTruthy();
    });

  });

  describe('Functionality', () => {

    it("should correctly add a new task", () => {
      let inputElem = element(by.id('task-until-input')),
        todayEntry = element.all(by.className('_720kb-datepicker-active'))
          .filter((elem) => elem.getAttribute('ng-click').then((attr) => {
            return /datepickerDay/i.test(attr);
          })),
        textarea = element(by.tagName('textarea')),
        submitButton = element(by.id('create-task-button')),
        todoEntries = element.all(by.className('list-group-item')),
        mostRecentEntry = todoEntries.last().element(by.binding('todo.description'));

      let testTaskName = "Testing task";

      inputElem.click();
      todayEntry.first().click();
      textarea.sendKeys(testTaskName);
      submitButton.click();

      expect(todoEntries.count()).toEqual(3);
      expect(mostRecentEntry.getText()).toEqual(testTaskName);
    });

    it('should correctly remove a task from the list', () => {
      let removeIcons = element.all(by.className('remove-item')),
        todoEntries = element.all(by.className('list-group-item')),
        taskDescriptions = todoEntries.all(by.binding('todo.description'));

      removeIcons.get(1).click();

      expect(todoEntries.count()).toEqual(2);
      expect(taskDescriptions.first().getText()).toEqual("First task");
      expect(taskDescriptions.last().getText()).toEqual("Testing task");
    });
  });

});