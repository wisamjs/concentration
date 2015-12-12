import React from 'react';
import './_card.scss';
import classnames from 'classnames';

export default class Card extends React.Component {
    render() {
      let classes = classnames('flip-container', {'card-active': this.props.flipped}, {'pulse': this.props.content.audio.status === 'play'});
      var test='https://i.scdn.co/image/c08a3c6597f70e7fb7c229ef9faa55e2fbc13b54';

    return (
      <div className={classes} onClick={this.flipCard.bind(this)}>
        <div className="flipper">
          <div className="front">
            <img className="unflipped-cover" src="http://www.carlsednaoui.com/images/posts/spotify-1.png" />
          </div>
          <div className="back">
            <span className="back--top-banner"></span>
            <img className="album-cover" src={ "" + this.props.content.image} />
            <span className="back--bottom-banner"></span>

          </div>
        </div>
      </div>
    );
  }

  flipCard() {
    return this.props.flipCard(this.props.ID);
  }

}
