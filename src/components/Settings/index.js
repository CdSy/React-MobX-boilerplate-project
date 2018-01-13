import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import './style.css';

@inject("uiStore")
@observer
class Settings extends Component {
  render() {
    return (
        <div className="p-settings">
            <div className="g-page-title">Available Themes</div>
            <div className="p-themes-wrapper">
                {
                    this.props.uiStore.themeList.map((theme, i) => {
                        return (
                            <div className={`b-theme-card ${this.props.uiStore.currentTheme === theme ? 'active' : ''}`} 
                                 onClick={() => this.props.uiStore.changeTheme(theme)}
                                 key={i}>
                                <div className={`color ${theme}`}>
                                    <i className="fas fa-check-circle icon"></i>
                                </div>
                                <div className="name">{theme}</div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
  }
}

export default Settings;