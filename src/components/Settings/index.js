import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import './style.css';

@inject("uiStore")
@observer
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { in: true };
  }

  componentWillUnmount() {
    this.setState({in: false});
  }

  renderCard() {
    return (
      this.props.uiStore.themeList.map((theme, i) => {
        return (
          <div className={`b-theme-card animated-child ${this.props.uiStore.currentTheme === theme ? 'active' : ''}`} 
               onClick={() => this.props.uiStore.changeTheme(theme)}
               key={i}>
            <div className={`color ${theme}`}>
              <i className="fas fa-check-circle icon"></i>
            </div>
            <div className="name">{theme}</div>
          </div>
        );
      })
    );
  }

  render() {
    const cards = this.renderCard();

    return (
        <div className="g-card-content">
          <div className="g-page-title">Available Themes</div>
          <div className="p-themes-wrapper">
            {cards}
          </div>
        </div>
    )
  }
}

export default Settings;