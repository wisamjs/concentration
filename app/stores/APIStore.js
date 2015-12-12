'use strict';

import R from 'ramda';
import assign from 'object-assign';
import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher.js';
import { CHANGE_EVENT, ActionTypes } from '../constants/Constants.js';


class APIStore extends EventEmitter {
    constructor() {
      super();
      this.init();
    }

  init = () => {

  }

  addChangeListener(fn) {
    this.addListener(CHANGE_EVENT, fn);
  }

  removeChangeListener(fn) {
    this.removeListener(CHANGE_EVENT, fn);
  }

  setState = (newState) => {
    this.state = assign(this.state, newState);
    this.emit(CHANGE_EVENT);
  }


  _handleAction(payload) {
    var { action } = payload;

    switch (action.type) {
    case ActionTypes.LOAD_CARDS:
      this.setState(this.getState());
      break;

    case ActionTypes.FLIP_CARD:
    this.handleFlip(action.ID);
      break;
    }
  }
}

export default new APIStore();
