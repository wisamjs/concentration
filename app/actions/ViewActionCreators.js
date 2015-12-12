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

  loginToSpotify() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.LOGIN_TO_SPOTIFY
    });
  }
}

export default new ViewActionCreators();
