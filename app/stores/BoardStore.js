import assign from 'object-assign';
import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher.js';
import { CHANGE_EVENT, ActionTypes } from '../constants/Constants.js';

class BoardStore extends EventEmitter {
    constructor() {
      super();
      this.state = {
        message: 'Hello !World'
      };

    this.dispatchToken = AppDispatcher.register(this._handleAction.bind(this));
    }

  addChangeListener(fn) {
    this.addListener(CHANGE_EVENT, fn);
  }

  removeChangeListener(fn) {
    this.removeListener(CHANGE_EVENT, fn);
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = assign(this.state, newState);
    this.emit(CHANGE_EVENT);
  }

  _handleAction(payload) {
    var { action } = payload;
    //var action = payload.action;

    switch (action.type) {
    case ActionTypes.LOAD_CARDS:
      this.setState(this.getState());
      break;

    case ActionTypes.FLIP_CARD:
      this.setState({
        message: 'something'
      });
      break;
    }
  }
}

export default new BoardStore();
