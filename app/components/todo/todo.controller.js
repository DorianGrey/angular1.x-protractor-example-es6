import moment from 'moment';

export class TodoController {
  constructor() {
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
        until: moment().toDate()
      },
      {
        description: 'Second task',
        priority: this.priorityOptions[1],
        until: moment().toDate()
      }
    ];

    this.newTask = {
      description: '',
      priority: this.priorityOptions[1],
      until: null,
      minDate: moment().subtract(1, 'days').toISOString()
    };

    let resetNewTask = (function () {
      this.newTask.description = '';
      this.newTask.until = null;
      this.newTask.priority = this.priorityOptions[1];
    }).bind(this);

    this.createTask = function () {
      let newTask = {
        description: this.newTask.description,
        until: this.newTask.until,
        priority: this.newTask.priority
      };

      // TODO: Some ordering would be lovely here!
      this.todos.push(newTask);

      resetNewTask();
    };

    this.removeTask = function (idx) {
      this.todos.splice(idx, 1);
    };
  }
}