import React, { Component } from 'react';
import './style.css';

class Slider extends Component {
  duration =  5000;
  animKeys = [
    "left1",
    "left2",
    "left3",
    "cr",
    "right1",
    "right2",
    "right3",
  ];
  state = {
    cards: [
      {className: "odd", animKey: "1"},
      {className: "even", animKey: "2"},
      {className: "odd", animKey: "3"},
      {className: "even", animKey: "c"},
      {className: "odd", animKey: "4"},
      {className: "even", animKey: "5"},
      {className: "odd", animKey: "6"},
    ],
    offset: 0
  }

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    const offset = this.state.offset <= 6 ? this.state.offset + 1 : 1;
    const sortedKeys = this.sortKeys(offset);
    const copiedCards = [...this.state.cards];

    copiedCards.forEach((card, i) => {
      card.animKey = sortedKeys[i];
    });

    this.setState({offset, cards: copiedCards});

    setTimeout(() => {
      const copiedCards = [...this.state.cards];
      
      copiedCards.forEach((card, i) => {
        let key = sortedKeys[i];

        if (key === "cr") {
          key = "cl"
        }

        card.animKey = key;
      });

      this.setState({cards: copiedCards});
    }, this.duration / 3);

    setTimeout(() => {
      this.startAnimation();
    }, this.duration);
  }

  sortKeys = (offset) => {
    const firstPartKeys = this.animKeys.slice(0, this.animKeys.length - offset);
    const secondPartKeys = this.animKeys.slice(this.animKeys.length - offset);
    const sortedKeys = [...secondPartKeys, ...firstPartKeys];

    return sortedKeys;
  }

  render() {
    return (
      <div className="g-card-content padding-offset">
        <div className="b-slider">
          <div className="center-card">
            Gallery
            <div className="slide-wrapper">
              {this.state.cards.map((card, i) => {
                return (
                  <div className={`card ${card.className} ${card.animKey}`} key={i}>
                    {i}
                    <div className="card-popover">
                      Text
                      <div className="arrow"></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Slider;