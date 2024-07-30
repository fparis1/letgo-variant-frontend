import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AppHeader.css';

const AppHeader = (props) => {
    return (
        <header className="app-header">
            <div className="container">
                <div className="app-branding">
                    <Link to="/" className="app-title">Letgo variant</Link>
                </div>
                <div className="app-options">
                    <nav className="app-nav">
                        {props.authenticated ? (
                            <ul>
                                <li>
                                    <NavLink to="/post-item">Post new item</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/profile">Profile</NavLink>
                                </li>
                                <li>
                                    <a onClick={props.onLogout}>Logout</a>
                                </li>
                            </ul>
                        ) : (
                            <ul>
                                <li>
                                    <NavLink to="/post-item">Post new item</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/login">Login</NavLink>        
                                </li>
                                <li>
                                    <NavLink to="/signup">Signup</NavLink>        
                                </li>
                            </ul>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;