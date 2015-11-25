import moment from 'moment';

export class TodoController {
  constructor($element) {
    this.warning = {
      indicator: $element.find('#something-failed-indicator'),
      message: '',
      dismiss: () => {
        this.warning.message = '';
        this.warning.indicator.hide();
      },
      show: (warningText) => {
        this.warning.message = warningText;
        this.warning.indicator.show();
      }
    };
    this.warning.indicator.hide();

    this.slider = {
      min: 1,
      max: 10
    };

    this.priorityOptions = [
      'Could not care less',
      'Eventually',
      'Urgent'
    ];

    this.priorityToCategory = {
      'Could not care less': 'default',
      'Eventually': 'warning',
      'Urgent': 'danger'
    };

    this.todos = [
      {
        description: 'First task',
        priority: this.priorityOptions[1],
        until: moment().toDate(),
        people: 3
      },
      {
        description: 'Second task',
        priority: this.priorityOptions[1],
        until: moment().toDate(),
        people: 5
      }
    ];

    this.newTask = {
      description: '',
      priority: this.priorityOptions[1],
      until: null,
      minDate: moment().subtract(1, 'days').toISOString(),
      people: 1
    };

    let resetNewTask = (function () {
      this.newTask.description = '';
      this.newTask.until = null;
      this.newTask.priority = this.priorityOptions[1];
      this.newTask.people = 1;
    }).bind(this);

    this.createTask = function () {
      let newTask = {
        description: this.newTask.description,
        until: this.newTask.until,
        priority: this.newTask.priority,
        people: this.newTask.people
      };

      // TODO: Some ordering might be lovely here!
      this.todos.push(newTask);

      resetNewTask();
    };

    let calcResultOf = (function () {
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

    let createRemovePromptQuestion = (function () {
      let getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      };
      let calcOptions = ['+', '-', '*', '/'];

      return function () {
        let combinator = calcOptions[getRandomInt(0, 4)],
          val1 = getRandomInt(0, 100),
          val2 = getRandomInt(1, 100);

        let expectedResult = calcResultOf(val1, combinator, val2);

        return {
          expectedResult: expectedResult,
          question: `Please enter the INTEGER result of: ${val1} ${combinator} ${val2}`
        };
      };
    })();

    this.removeTask = function (idx) {
      let securityCheck = createRemovePromptQuestion();
      let result = window.prompt(securityCheck.question);
      if (parseInt(result) === securityCheck.expectedResult) {
        this.todos.splice(idx, 1);
      } else {
        this.warning.show(`Unexpected result ${result} - entry was not deleted!`);
      }
    };
  }
}