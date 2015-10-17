import React from 'react';
import './_card.scss';
import classnames from 'classnames';

export default class Card extends React.Component {
    render() {
      let classes = classnames('flip-container', {'card-active': this.props.flipped});

    return (
      <div className={classes} onClick={this.flipCard.bind(this)}>
        <div className="flipper">
          <div className="front">
            <p>?</p>
          </div>
          <div className="back">
            <p>{this.props.content}</p>
          </div>
        </div>
      </div>
    );
  }

  flipCard() {
    return this.props.flipCard(this.props.ID);
  }

}
