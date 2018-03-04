import React, { Component } from 'react';
import './style.css';

class Slider extends Component {
  timeout = null;
  timeout2 = null;
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
      {className: "odd", animKey: "1", price: "792"},
      {className: "even", animKey: "2", price: "564"},
      {className: "odd", animKey: "3", price: "850"},
      {className: "even", animKey: "c", price: "940"},
      {className: "odd", animKey: "4", price: "430"},
      {className: "even", animKey: "5", price: "355"},
      {className: "odd", animKey: "6", price: "820"},
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

    clearTimeout(this.timeout2);
    this.timeout2 = null;
    this.timeout2 = setTimeout(() => {
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

    clearTimeout(this.timeout);
    this.timeout = null;
    this.timeout = setTimeout(() => {
      this.startAnimation();
    }, this.duration);
  }

  sortKeys = (offset) => {
    const firstPartKeys = this.animKeys.slice(0, this.animKeys.length - offset);
    const secondPartKeys = this.animKeys.slice(this.animKeys.length - offset);
    const sortedKeys = [...secondPartKeys, ...firstPartKeys];

    return sortedKeys;
  }

  moveCards(index) {
    clearTimeout(this.timeout);
    this.timeout = null;
    clearTimeout(this.timeout2);
    this.timeout2 = null;
    this.setState({offset: index});
    this.startAnimation();
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
                  <div className={`card ${card.className} ${card.animKey}`} key={i} onClick={() => this.moveCards(i)}>
                    {i}
                    <div className="card-popover">
                      <div className="price-wrapper">
                        <i className="fas fa-shopping-cart cart-icon"></i>
                        <div className="price">
                          <div className="old">{`$${card.price}`}</div>
                          <div className="new">$0</div>
                        </div>
                      </div>
                      <div className="button">
                        <div className="text">Try for free</div>
                        <div className="loader"><i className="fas fa-spinner icon"></i></div>
                        <div className="checked"><i className="fas fa-check"></i></div>
                      </div>
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