import React from 'react';
import Card from '../card/card';
import BoardStore from '../../stores/BoardStore';
import BoardActions from '../../actions/ViewActionCreators';

export default class Board extends React.Component {
  state = {};

  componentDidMount() {
    BoardStore.addChangeListener(this.handleStoreChange);
    BoardActions.loadCards();
  }

  componentWillUnmount() {
    BoardStore.removeChangeListener(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(BoardStore.getState());
  }

  render() {
    return (
      <div className='app'>
        <h1>{this.state}</h1>
          <Card></Card>
      </div>
    );
  }
}
