import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Header = () => {
    return (
        <header className="App-header">
            <h1 className="App-title">Welcome to React</h1>
            <ul>
                <li>
                    <Link to='/table'>Table</Link>
                </li>
                <li>
                    <Link to='/list'>List</Link> 
                </li>
            </ul>
        </header>
    );
}

export default Header;