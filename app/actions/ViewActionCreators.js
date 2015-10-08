import { ActionTypes } from '../constants/Constants.js';
import AppDispatcher from '../dispatcher/AppDispatcher.js';

class ViewActionCreators {
  loadCards() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.LOAD_CARDS
    });
  }

  flipCard(card) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.FLIP_CARD,
      card: card
    });
  }
}

export default new ViewActionCreators();
