import React from 'react';
import Card from '../card/card';
import CardStore from '../../stores/CardStore';
import BoardActions from '../../actions/ViewActionCreators';

export default class Concentration extends React.Component {
  state = {};

  componentDidMount() {
    CardStore.addChangeListener(this.handleStoreChange);
    BoardActions.loadCards();
  }

  componentWillUnmount() {
    CardStore.removeChangeListener(this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState(CardStore.getState());
  }

  flipCard(ID) {
    BoardActions.flipCard(ID);
  }

  render() {
    if (this.state.cards) {
      var cards = this.state.cards.map(function(card) {
        return <Card ID={card.ID} matchID={card.matchID} content={card.content} flipCard={this.flipCard} flipped={card.flipped} ></Card>
      }, this);

    }

    return (
      <div className='app'>
        <h1>Concentration</h1>
          {cards}
      <pre>{JSON.stringify(this.state, null, 2)}</pre>

      </div>
    );
  }
}
