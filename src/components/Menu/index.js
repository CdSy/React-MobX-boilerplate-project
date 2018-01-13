import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from "mobx-react";
import './style.css';

@inject("uiStore", "routing")
@observer
class Menu extends Component {
  render() {
    const { location } = this.props.routing;
    const path = location.pathname.slice(1);
    console.log(path);

    return (
      <div className={`b-sidebar-menu ${this.props.uiStore.menuIsOpen ? 'open' : 'close'}
        ${this.props.uiStore.menuIsNarrow ? 'narrow' : 'wide'}
      `}>
        <ul className="list">
          <li className={`item ${path === 'profile' ? 'active' : ''}`}>
            <Link to='/profile'>
              <i className="fas fa-user-circle icon"></i>
              <div className="text">Profile</div>
            </Link>
          </li>
          <li className={`item ${path === 'settings' ? 'active' : ''}`}>
            <Link to='/settings'>
              <i className="fas fa-cog icon"></i>
              <div className="text">Change Theme</div>
            </Link>
          </li>
        </ul>
        <div className={`toggle-button ${this.props.uiStore.menuIsNarrow ? 'right' : 'left'}`} 
             onClick={this.props.uiStore.widthMenuToggle}>
          <i className="fas fa-angle-double-right icon"></i>
        </div>
      </div>
    );
  }
}

export default Menu;
