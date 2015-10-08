import { Dispatcher } from 'flux';

class AppDispatcher extends Dispatcher {
  handleViewAction(action) {
    var payload = {
      source: 'VIEW_ACTION',
      action: action
    };
    this.dispatch(payload);
  }
}

export default new AppDispatcher();
