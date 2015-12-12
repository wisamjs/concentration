import React from 'react';
import Card from '../card/card';
import CardStore from '../../stores/CardStore';
import BoardActions from '../../actions/ViewActionCreators';
import './_concentration.scss';

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

  loginToSpotify(e){
    BoardActions.loginToSpotify();

  }

  render() {
    if (this.state.cards) {
      var cards = this.state.cards.map(function(card) {
        return <Card ID={card.ID} matchID={card.matchID} content={card.content} flipCard={this.flipCard} flipped={card.flipped} ></Card>
      }, this);

    }

    var debug;

    if(this.debugMode) {
      debug = <pre>{JSON.stringify(this.state.cards, null, 2)}</pre>;
    }

    return (
      <div className='app'>
        <div className="triangle">
        </div>
        <h1>Concentration</h1>
        <button onClick={this.loginToSpotify.bind(this)}>Spotify</button>
        <div className="Board">
          {cards}
        </div>
        {debug}
      </div>
    );
  }
}
