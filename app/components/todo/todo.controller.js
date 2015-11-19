import moment from 'moment';

export class TodoController {
  constructor() {
    this.todos = [
      {
        description: 'First task',
        until: moment().toDate()
      },
      {
        description: 'Second task',
        until: moment().toDate()
      }
    ];

    this.newTask = {
      description: '',
      until: null,
      minDate: moment().subtract(1, 'days').toISOString()
    };

    let resetNewTask = (function () {
      this.newTask.description = '';
      this.newTask.until = null;
    }).bind(this);

    this.createTask = function () {
      let newTask = {
        description: this.newTask.description,
        until: this.newTask.until
      };

      // TODO: Some ordering would be lovely here!
      this.todos.push(newTask);

      resetNewTask();
    };

    this.removeTask = function(idx) {
      this.todos.splice(idx, 1);
    };
  }
}