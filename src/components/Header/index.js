import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import MenuButton from './MenuButton';
import './style.css';

@inject("uiStore")
@observer
class Header extends Component {
  render() {
    return (
      <header className="b-header">
        <MenuButton isActive={this.props.uiStore.menuIsOpen} clickHandler={this.props.uiStore.stateMenuToogle}/>
        <div>Sing In</div>
      </header>
    )
  }
}

export default Header;