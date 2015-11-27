'use strict';

import {TodoPage} from '../objects/todo.page';
import {HeaderComponent} from '../objects/header.component';

import wait from '../helper/wait';

describe('A more complex test for the "TODO list" page', function () {

  beforeAll(() => {
    browser.get("/");
    this.header = new HeaderComponent();
    this.todoPage = new TodoPage();

    // This is a workaround for Firefox, which regularly fails to correctly scroll the page when interacting with the date picker.
    if (/firefox/.test(global.browserCapabilities.get('browserName'))) {
      browser.driver.manage().window().setSize(1024, 2048);
    }
  });

  describe('General layout', () => {
    it('should correctly move to the "TODO list" page', () => {
      this.header.todoPageRef.click();

      wait.presence(this.todoPage.root);

      since('After clicking the corresponding link, we should move to the TODO-list page').expect(this.todoPage.root.isDisplayed()).toBeTruthy();
    });

    it('should correctly list two example tasks', () => {
      since('There should be two elements initially').expect(this.todoPage.todoEntries.count()).toEqual(2);
    });

    it('should display tasks with descriptions "First task" and "Second task"', () => {
      since('The first entry\'s description should be "First task"').expect(this.todoPage.todoEntries.descriptions.first().getText()).toEqual('First task');
      since('The second entry\'s description should be "Second task"').expect(this.todoPage.todoEntries.descriptions.last().getText()).toEqual('Second task');
    });

    it('should correctly display entries to create a new task: A textarea, a datepicker, and a button to submit the task', () => {
      let newTodo = this.todoPage.newTodo;
      since('There should be a textarea for the description').expect(newTodo.textarea.isDisplayed()).toBeTruthy();
      since('There should be a datepicker for the target date').expect(newTodo.datepicker.isDisplayed()).toBeTruthy();
      since('There should be a slider for the priority selection').expect(newTodo.prioritySelection.isDisplayed()).toBeTruthy();
      since('There should be a button to submit a new task').expect(newTodo.submitButton.isDisplayed()).toBeTruthy();
    });

    it('should not be possible to submit a task without entering some text', () => {
      since('The submit button should be initially disabled').expect(this.todoPage.newTodo.submitButton.getAttribute('aria-disabled')).toBeTruthy();
    });

    it('should highlight the textarea as invalid, since it is empty by default', () => {
      since('The textarea should be highlighted as invalid').expect(this.todoPage.newTodo.textarea.getAttribute('aria-invalid')).toBeTruthy();
    });

  });

  describe('Functionality', () => {

    beforeAll(() => {
      let self = this;
      this.handleAlert = function () {
        return browser.switchTo().alert().then(function (alert) {
          return alert.getText()
            .then(function (text) {
              // Extract values.
              let matcher = /(\d+)\s+(\+|-|\*|\/)\s+(\d+)/;
              let [left, op, right] = text.match(matcher).slice(1);

              left = parseInt(left);
              right = parseInt(right);

              let calculatedResult = self.todoPage.calcResultOf(left, op, right).toString();

              alert.sendKeys(calculatedResult);
              return alert.accept();
            });
        });
      };
    });

    it('should correctly add a new task', () => {
      let testTaskName = 'Testing task';

      this.todoPage.moveSliderHandleTo(this.todoPage.newTodo.datepicker);
      this.todoPage.createTodoForToday(testTaskName);

      // Date will not be tested explicitly, since it might be illustrated in a language-dependent way.
      let newDesc = this.todoPage.todoEntries.descriptions.last(),
        newPriority = this.todoPage.todoEntries.priorities.last(),
        newPeopleCnt = this.todoPage.todoEntries.peopleCounters.last();

      since('After creating an additional task, there should now be three of them').expect(this.todoPage.todoEntries.count()).toEqual(3);
      since('The new task\'s description should be displayed as entered').expect(newDesc.getText()).toEqual(testTaskName);
      since('The new task\'s priority should be labelled as "Could not care less"').expect(newPriority.getText()).toEqual('Could not care less');
      since('The amount of people required for the task should be listed with "10"').expect(newPeopleCnt.getText()).toEqual('10');
      since('The new task\'s description should match the entered one').expect(this.todoPage.todoEntries.mostRecentEntry.getText()).toEqual(testTaskName);
    });

    it('should correctly remove a task from the list', (done) => {
      let self = this;
      this.todoPage.todoEntries.removeIcons.get(1).click()
        .then(this.handleAlert)
        .then(function () {
          since('After deleting an entry, their amount should change back to two').expect(self.todoPage.todoEntries.count()).toEqual(2);
          since('The first entry\'s description should still be "First task"').expect(self.todoPage.todoEntries.descriptions.first().getText()).toEqual('First task');
          since('The second entry\'s description should now be "Testing task"').expect(self.todoPage.todoEntries.descriptions.last().getText()).toEqual('Testing task');
          done();
        });
    });

    it('should increase the amount of visible tasks by one if a new task was added', (done) => {
      this.todoPage.todoEntries.count().then((oldCount) => {
        this.todoPage.createTodoForToday('Another test task');
        this.todoPage.todoEntries.count().then((newCount) => {
          // Expectation
          since('The difference in task amount should be one').expect(newCount - oldCount).toEqual(1);
          // Cleanup
          this.todoPage.todoEntries.removeIcons.last().click()
            .then(this.handleAlert)
            .then(done);
        });
      });
    });

  });

});