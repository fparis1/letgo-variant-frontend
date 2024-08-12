import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { ACCESS_TOKEN } from '../constants';
import categories from '../constants/categories';

const Home = () => {
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        fetchItems();
    }, [currentPage, selectedCategory, selectedSubcategory]);

    const fetchItems = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get('http://localhost:8080/getItems', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { 
                page: currentPage,
                size: pageSize,
                category: selectedCategory,
                subcategory: selectedSubcategory
            }
        })
        .then(response => {
            setItems(prevItems => [...prevItems, ...response.data.content]);
            setTotalPages(response.data.totalPages);
        })
        .catch(error => {
            console.error("There was an error fetching the items: ", error);
        });
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleCategoryClick = (category, subcategory = '') => {
        if (category === selectedCategory && subcategory === selectedSubcategory) {
            return; // Do nothing if the clicked category and subcategory are already selected
        }
        setSelectedCategory(category);
        setSelectedSubcategory(subcategory);
        setItems([]); // Clear items when category changes
        setCurrentPage(0); // Reset to first page
        setDropdownOpen(false); // Close dropdown on selection
    };

    return (
        <div className='container home-container'>
            <div className="navbar">
                <div className="dropdown-container">
                    <div 
                        className={`dropdown ${dropdownOpen ? 'open' : ''}`} 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <button className="dropdown-toggle">
                            {selectedCategory ? `${selectedCategory}${selectedSubcategory ? ` > ${selectedSubcategory}` : ''}` : 'Select Category'}
                            <span className={`arrow ${dropdownOpen ? 'up' : 'down'}`}></span>
                        </button>
                        <div className="dropdown-menu">
                            <div className="container">
                                <div className="row">
                                    {Object.keys(categories).map(categoryKey => (
                                        <div key={categoryKey} className="col-md-3 mb-4">
                                            <div className="dropdown-item">
                                                <div 
                                                    onClick={() => handleCategoryClick(categories[categoryKey].en)}
                                                    className="category"
                                                >
                                                    {categories[categoryKey].hr}
                                                </div>
                                                {dropdownOpen && categories[categoryKey].subcategories.map(subcategory => (
                                                    <div 
                                                        key={subcategory.hr} 
                                                        onClick={() => handleCategoryClick(categories[categoryKey].en, subcategory.en)}
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
                <div className="additional-links">
                    <a href="#link1">Link 1</a>
                    <a href="#link2">Link 2</a>
                    <a href="#link3">Link 3</a>
                </div>
            </div>
            <div className="selected-categories">
                <span>Selected Category: </span>
                {selectedCategory && (
                    <span className="selected-category" onClick={() => handleCategoryClick(selectedCategory)}>
                        {selectedCategory}
                    </span>
                )}
                {selectedSubcategory && (
                    <>
                        <span> &gt; </span>
                        <span className="selected-subcategory" onClick={() => handleCategoryClick(selectedCategory, selectedSubcategory)}>
                            {selectedSubcategory}
                        </span>
                    </>
                )}
            </div>
            <div className="container mt-5">
                <div className="row">
                    {items.map(item => {
                        const base64String = item.photo.data;
                        const mimeType = item.photo.contentType;
                        const itemUrl = `/view-item/${item.id}`;
                        
                        return (
                            <div key={item.id} className="col-md-4 mb-4">
                                <a href={itemUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card h-100">
                                        <img 
                                            className="card-img-top" 
                                            src={`data:${mimeType};base64,${base64String}`} 
                                            alt={item.photo.fileName} 
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text">{parseInt(item.price)} <b>€</b></p>
                                            <div className="card-footer">
                                                <span className="location">{item.county}, {item.city}</span>
                                                <span className="date">{new Date(item.createdDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        );
                    })}
                </div>
                {currentPage < totalPages - 1 && 
                    <button 
                        onClick={handleLoadMore} 
                        className="btn btn-primary">
                        Load More
                    </button>}
            </div>
        </div>
    );
};

export default Home;