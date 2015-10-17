'use strict';

import R from 'ramda';
import assign from 'object-assign';
import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher.js';
import { CHANGE_EVENT, ActionTypes } from '../constants/Constants.js';

class CardStore extends EventEmitter {
    constructor() {
      super();
      this.initializeState();
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

  initializeState() {
    this.cardContents = R.range[1,10];
    this.cardIndex = 0;
      this.state = {
        cards: this.setupCards(10)
      };
  }

  cardContent = () => {

  }

  setupCards(total) {

    return R.flatten(Array.apply(null , Array(total))
    .map(function(){
      return this.createCardPair(this.getUniqueID(), this.getUniqueID());
    },this))
    .sort(this.randomize())

  }

  createCardPair(ID, matchID) {


    return [{
      ID: ID,
      matchID: matchID,
      flipped: false,
      content: ID
    },{
      ID: matchID,
      matchID: ID,
      flipped: false,
      content: ID
    }];
  }

  getUniqueID() {
    return this.cardIndex += 1;
  }

  randomize = (cardA, cardB) => {
    return cardA.ID < cardB.ID;

  }

  SingleCardAlreadyFlipped = () => {
    return this.flippedCards().length % 2;
  }

  flippedCards() {
    return R.filter(R.propEq('flipped', true), this.state.cards);
  }

  handleFlip(ID) {
    // Cant flip an already flipped card
    if (!this.card(ID).flipped) {
      return R.ifElse(this.SingleCardAlreadyFlipped, this.checkCard, this.flipCard)(ID);
    }
  }

  flipCard = (ID) => {
      this.setState({
        cards: R.map(function updateStatus(card) {
        if (card.ID === ID) {
          card.flipped = true;
        }
        return card;

      }, this.state.cards)});
  }

  unflipCard = (ID) => {
    this.setState({
          cards: R.map(function updateStatus(card) {
          if (card.ID === ID){
            card.flipped = false;
          }
          return card;
        }, this.state.cards)});
  }

  card = (ID) => {
    return R.compose(R.head, R.filter(R.propEq('ID',ID)))(this.state.cards);
  }

  match = (ID) => {
    function isMatch(card) {
      return R.propEq('flipped', true)(card) && R.propEq('matchID', ID)(card);
    }

    return R.length(R.filter(isMatch, this.state.cards)) % 2;
  }

  randomize = (arr) => {
  }

  checkCard = (ID) => {
    var that = this;
    this.flipCard(ID);
    if (this.match(ID)) {

    } else {

      //Detect if card's match is already a flipped card
      var hasMatchInFlippedCards = (card) => {
        return R.containsWith(
          function hasMatch(cardA, cardB) {
            return R.propEq('ID', cardB.matchID)(cardA) && R.propEq('flipped', true)(cardA);
          }, card, this.flippedCards());
      }

    var unmatchedCards =
      this.flippedCards()
      .filter(function(card) {
        return (R.not(hasMatchInFlippedCards(card, this.flippedCards())));
      }, this);

      var unmatchedCard = R.head(unmatchedCards);
      console.log(unmatchedCards);
    setTimeout(() => {
      unmatchedCards.map(function(card) {
        this.unflipCard(card.ID);
      }, this);

    }, 500);
    }
  }

  setState = (newState) => {
    this.state = assign(this.state, newState);
    this.emit(CHANGE_EVENT);
  }

  flippedCards = () => {
    return R.filter(R.propEq('flipped', true), this.state.cards);
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

export default new CardStore();
