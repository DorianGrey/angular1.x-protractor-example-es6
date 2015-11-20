'use strict';

import {TodoPage} from '../objects/todo.page';
import {HeaderComponent} from '../objects/header.component';

describe('A more complex test for the "TODO list" page', function () {

  beforeAll(() => {
    browser.get("/");
    this.header = new HeaderComponent();
    this.todoPage = new TodoPage();
  });

  describe('General layout', () => {
    it('should correctly move to the "TODO list" page', () => {
      this.header.todoPageRef.click();
      expect(this.todoPage.root.isDisplayed()).toBeTruthy();
    });

    it('should correctly list two example tasks', () => {
      expect(this.todoPage.todoEntries.count()).toEqual(2);
    });

    it('should display tasks with descriptions "First task" and "Second task"', () => {
      expect(this.todoPage.todoEntries.descriptions.first().getText()).toEqual("First task");
      expect(this.todoPage.todoEntries.descriptions.last().getText()).toEqual("Second task");
    });

    it('should correctly display entries to create a new task: A textarea, a datepicker, and a button to submit the task', () => {
      let newTodo = this.todoPage.newTodo;
      expect(newTodo.textarea.isDisplayed()).toBeTruthy();
      expect(newTodo.datepicker.isDisplayed()).toBeTruthy();
      expect(newTodo.submitButton.isDisplayed()).toBeTruthy();
    });

    it('should not be possible to submit a task without entering some text', () => {
      expect(this.todoPage.newTodo.submitButton.getAttribute('aria-disabled')).toBeTruthy();
    });

    it('should highlight the textarea as invalid, since it is empty by default', () => {
      expect(this.todoPage.newTodo.textarea.getAttribute('aria-invalid')).toBeTruthy();
    });

  });

  describe('Functionality', () => {

    it("should correctly add a new task", () => {
      let testTaskName = "Testing task",
        newTodo = this.todoPage.newTodo;

      newTodo.datepicker.inputElem.click();
      newTodo.datepicker.todayEntry.first().click();
      newTodo.textarea.sendKeys(testTaskName);
      newTodo.submitButton.click();

      expect(this.todoPage.todoEntries.count()).toEqual(3);
      expect(this.todoPage.todoEntries.mostRecentEntry.getText()).toEqual(testTaskName);
    });

    it('should correctly remove a task from the list', () => {
      this.todoPage.todoEntries.removeIcons.get(1).click();

      expect(this.todoPage.todoEntries.count()).toEqual(2);
      expect(this.todoPage.todoEntries.descriptions.first().getText()).toEqual("First task");
      expect(this.todoPage.todoEntries.descriptions.last().getText()).toEqual("Testing task");
    });
  });

});