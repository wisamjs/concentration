import { ActionTypes } from '../constants/Constants.js';
import AppDispatcher from '../dispatcher/AppDispatcher.js';

class ViewActionCreators {
  loadCards() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.LOAD_CARDS
    });
  }

  flipCard(ID) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.FLIP_CARD,
      ID: ID
    });
  }
}

export default new ViewActionCreators();
