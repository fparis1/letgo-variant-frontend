// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import categories from '../constants/categories';

const Navbar = ({ handleCategoryClick, dropdownOpen, setDropdownOpen }) => {
    return (
        <div className="navbar">
            <div className="dropdown-container">
                <div 
                    className={`dropdown ${dropdownOpen ? 'open' : ''}`} 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <button className="dropdown-toggle">
                        {'Odaberi kategoriju'}
                        <span className={`arrow ${dropdownOpen ? 'up' : 'down'}`}></span>
                    </button>
                    <div className="dropdown-menu">
                        <div className="container">
                            <div className="row">
                                {Object.keys(categories).map(categoryKey => (
                                    <div key={categoryKey} className="col-md-3 mb-4">
                                        <div className="dropdown-item">
                                            <div 
                                                onClick={() => handleCategoryClick(categories[categoryKey].en, categories[categoryKey].hr)}
                                                className="category"
                                            >
                                                {categories[categoryKey].hr}
                                            </div>
                                            {dropdownOpen && categories[categoryKey].subcategories.map(subcategory => (
                                                <div 
                                                    key={subcategory.hr} 
                                                    onClick={() => handleCategoryClick(categories[categoryKey].en, categories[categoryKey].hr, subcategory.en, subcategory.hr)}
                                                    className="subcategory"
                                                >
                                                    {subcategory.hr}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;