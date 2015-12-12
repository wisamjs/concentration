'use strict';

import R from 'ramda';
import querystring from 'querystring';
import assign from 'object-assign';
import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher.js';
import { CHANGE_EVENT, ActionTypes } from '../constants/Constants.js';
import APIStore from './APIStore.js';

class CardStore extends EventEmitter {
  constructor() {
    super();

    //Check URL for access tokens
    var accessToken = this.getUrlAccessToken();
    var refreshToken = this.getUrlRefreshToken();

    this.scaffoldGame();


    if (accessToken && refreshToken) {
      this.getAlbumCovers()
      .then(() => {
        this.setState(this.buildGame());
       });
    }


    this.dispatchToken = AppDispatcher.register(this._handleAction.bind(this));
  }

  addChangeListener(fn) {
    this.addListener(CHANGE_EVENT, fn);
  }

  getUrlAccessToken = () => {
    var queryString = location.search;
    if (queryString.indexOf('access_token') === -1) {
      return false;
    }

    return queryString.substring(queryString.indexOf('=') + 1 , queryString.indexOf('&'));

  }

  makeRequest  = (method, url, header) => {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    if (header) {
      xhr.setRequestHeader(header.name, header.value);
    }

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

  getUrlRefreshToken = () => {
    var queryString = location.search;
    if (queryString.indexOf('refresh_token') === -1){
      return false;
    }

    return queryString.substring(queryString.indexOf('refresh_token=') + 14, queryString.length)
  }

  getAlbumCovers = () => {
    return this.makeRequest('GET', encodeURI('https://api.spotify.com/v1/me/albums?limit=10'), {
      name: 'Authorization',
      value: 'Bearer ' + this.getUrlAccessToken()
    })
    .then(this.saveContents)
    .then(null, function(error) {
      throw error;

    });
  }

  saveContents = (responseText) => {
    var response = JSON.parse(responseText);
    this.contents = R.map(function(item) {
      return {
        image: item.album.images[0].url,
        tracks: item.album.tracks.items,
        audio: {

        }
      };
    },response.items);
    return response;
  }


  removeChangeListener(fn) {
    this.removeListener(CHANGE_EVENT, fn);
  }

  getState() {
    return this.state;
  }

  buildGame = () => {
    this.cardContents = R.range[1,10];
    this.cardIndex = 0;
    this.contextIndex = 0;
      this.state = {
        cards: this.setupCards(10)
      };
  }

  scaffoldGame = () => {
    this.state = {
      cards: []
    }
  }

  cardContent = (num) => {
    if (!this.contents) {
      this.contents =
      [ 'apples',
        'oranges',
        'kiwis',
        'tomatoes',
        'bananas',
        'chocolate',
        'mangoes',
        'watermelons',
        'grapes',
        'strawberries'
      ];
    }

    var content = this.contents[this.contextIndex];
    this.contextIndex += 1;
    return content;
  }

  setupCards = (total) => {
    var { createCardPair, getUniqueID, randomize } = this;
    var randomSort = R.sort(randomize);
    var generateCardPairs = R.map(function() {
      return createCardPair(getUniqueID(), getUniqueID());
    });

  var generateCards = R.compose(randomSort, R.flatten, generateCardPairs);
  return generateCards(Array.apply(null, Array(total)));

  }

  createCardPair = (ID, matchID) => {
    var content = this.cardContent(ID);

    return [{
      ID: ID,
      matchID: matchID,
      flipped: false,
      content: content
    },{
      ID: matchID,
      matchID: ID,
      flipped: false,
      content: content
    }];
  }

  getUniqueID = () => {
    return this.cardIndex += 1;
  }

  randomize = (cardA, cardB) => {

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
      return R.ifElse(this.SingleCardAlreadyFlipped, this.checkCard, this.flipCard)(ID, false);
    }
  }

  flipCard = (ID, playMusic) => {
      this.setState({
        cards: R.map(function updateStatus(card) {
        if (card.ID === ID) {
          card.flipped = true;
        }
        return card;

      }, this.state.cards)});

      if (playMusic) {
        this.playMusic(ID);
      }
  }

  playMusic = (ID) => {
      var card = this.card(ID);
      var randomNumber = 1;
      var track = card.content.tracks[randomNumber];

      if (track) {
        card.content.audio.track = new Audio(track.preview_url);
        card.content.audio.track.play();
        card.content.audio.status = 'play';
      }
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

  stopMusic = (ID) => {
    var card = this.card(ID);

    if (card.content.audio.track){
      card.content.audio.track.pause();
      card.content.audio.status = 'stop';
    }

  }

  pauseAllTracks = () => {
    R.forEach( function (card) {
      if (card.content.audio.track){
        card.content.audio.track.pause();
        card.content.audio.status = 'stop';
      }

    } , this.state.cards);
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

  randomize = () => {
    return Math.floor(Math.random() * 3) - 1
  }

  loginToSpotify = () => {
    var url = 'http://localhost:8888/api/login';
    var req = new XMLHttpRequest();
    req.addEventListener('load', reqListener);
    req.open('GET', url);
     req.send();

    function reqListener(res) {
      var response = JSON.parse(res.currentTarget.response);
      window.open(response.url);
    }
  }

  generateRandomString = (length) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  createCookie = (name, value, expires, path, domain) => {
    var cookie = name + "=" + escape(value) + ";";

    if (expires) {
      // If it's a date
      if(expires instanceof Date) {
        // If it isn't a valid date
        if (isNaN(expires.getTime()))
         expires = new Date();
      }
      else
        expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);

      cookie += "expires=" + expires.toGMTString() + ";";
    }

    if (path)
      cookie += "path=" + path + ";";
    if (domain)
      cookie += "domain=" + domain + ";";

    document.cookie = cookie;
}


  checkCard = (ID) => {
    this.flipCard(ID);
    if (this.match(ID)) {
      this.pauseAllTracks();
      this.playMusic(ID);

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

    case ActionTypes.LOGIN_TO_SPOTIFY:
    this.loginToSpotify();
    }
  }
}

export default new CardStore();
