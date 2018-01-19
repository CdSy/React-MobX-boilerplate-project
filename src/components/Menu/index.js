import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from "mobx-react";
import './style.css';

@inject("uiStore", "routing")
@observer
class Menu extends Component {
  render() {
    const { location } = this.props.routing;
    const path = location.pathname;

    return (
      <div>
        <div className={`b-sidebar-menu ${this.props.uiStore.menuIsOpen ? 'open' : 'closed'}
             ${this.props.uiStore.menuIsNarrow ? 'narrow' : 'wide'}
        `}></div>
        <div className={`b-sidebar-menu fixed ${this.props.uiStore.menuIsOpen ? 'open' : 'closed'}
          ${this.props.uiStore.menuIsNarrow ? 'narrow' : 'wide'}
        `}>
          <ul className="list">
            <li className={`item ${path === '/' ? 'active' : ''}`}>
              <Link to='/'>
                <i className="fas fa-home icon"></i>
                <div className="text">Home</div>
              </Link>
            </li>
            <li className={`item ${path === '/profile' ? 'active' : ''}`}>
              <Link to='/profile'>
                <i className="fas fa-user-circle icon"></i>
                <div className="text">Profile</div>
              </Link>
            </li>
            <li className={`item ${path === '/statistics' ? 'active' : ''}`}>
              <Link to='/statistics'>
                <i className="fas fa-chart-line icon"></i>
                <div className="text">Statistics</div>
              </Link>
            </li>
            <li className={`item ${path === '/settings' ? 'active' : ''}`}>
              <Link to='/settings'>
                <i className="fas fa-cog icon"></i>
                <div className="text">Change Theme</div>
              </Link>
            </li>
            <li className={`item ${path === '/employees' ? 'active' : ''}`}>
              <Link to='/employees'>
                <i className="fas fa-users icon"></i>
                <div className="text">Employees</div>
              </Link>
            </li>
          </ul>
          <div className={`toggle-button ${this.props.uiStore.menuIsNarrow ? 'right' : 'left'}`} 
               onClick={this.props.uiStore.widthMenuToggle}>
            <i className="fas fa-angle-double-right icon"></i>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
