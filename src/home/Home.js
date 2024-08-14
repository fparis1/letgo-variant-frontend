import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { ACCESS_TOKEN } from '../constants';
import categories from '../constants/categories';
import clothes_symbol from '../img/clothes_symbol.jpg';
import electronics_symbol from '../img/electronics_symbol.jpg';
import furniture_symbol from '../img/furniture_symbol.jpg';
import other_symbol from '../img/other_symbol.jpg';
import sport_symbol from '../img/sport_symbol.jpg';
import vehicle_symbol from '../img/vehicle_symbol.jpg';
import real_estate_symbol from '../img/real_estate_symbol.jpg';

const Home = () => {
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState({ en: '', hr: '' });
    const [selectedSubcategory, setSelectedSubcategory] = useState({ en: '', hr: '' });
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        fetchItems();
    }, [currentPage, selectedCategory.en, selectedSubcategory.en]);

    const fetchItems = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get('http://localhost:8080/getItems', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { 
                page: currentPage,
                size: pageSize,
                category: selectedCategory.en,
                subcategory: selectedSubcategory.en
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

    const handleCategoryClick = (categoryEn, categoryHr, subcategoryEn = '', subcategoryHr = '') => {
        if (categoryEn === selectedCategory.en && subcategoryEn === selectedSubcategory.en) {
            return; // Do nothing if the clicked category and subcategory are already selected
        }
        setSelectedCategory({ en: categoryEn, hr: categoryHr });
        setSelectedSubcategory({ en: subcategoryEn, hr: subcategoryHr });
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
            {selectedCategory.en === '' && (
                <div className="container mt-4">
                <div className="row justify-content-center">
                    {[
                        { src: electronics_symbol, label: 'Elektronika', categoryEn: 'Electronics', categoryHr: 'Elektronika' },
                        { src: vehicle_symbol, label: 'Vozila', categoryEn: 'Vehicles', categoryHr: 'Vozila' },
                        { src: real_estate_symbol, label: 'Nekretnine', categoryEn: 'Real Estate', categoryHr: 'Nekretnine' },
                        { src: furniture_symbol, label: 'Namještaj', categoryEn: 'Furniture', categoryHr: 'Namještaj' },
                        { src: clothes_symbol, label: 'Odjeća', categoryEn: 'Clothing', categoryHr: 'Odjeća' },
                        { src: sport_symbol, label: 'Sport', categoryEn: 'Sports', categoryHr: 'Sport' },
                        { src: other_symbol, label: 'Ostalo', categoryEn: 'Other', categoryHr: 'Ostalo' },
                    ].map(({ src, label, categoryEn, categoryHr }) => (
                        <div className="col-md-2 mx-n3" key={label}>
                            <div className="text-center">
                                <a onClick={() => handleCategoryClick(categoryEn, categoryHr)} style={{ cursor: 'pointer' }}>
                                    <img className="image-links" src={src} alt={label} />
                                    <div className="card-body">
                                        <p className="card-text">{label}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}
            <div className="selected-categories">
                {selectedCategory.hr !== '' && (
                    <span 
                        className="selected-category" 
                        onClick={() => handleCategoryClick('', '')}
                        style={{ cursor: 'pointer', color: '#007bff', marginRight: '5px' }}
                        >
                            Početna
                    </span>
                )}
                {selectedCategory.hr && (
                    <>
                        <span> &gt; </span>
                        <span className="selected-category" onClick={() => handleCategoryClick(selectedCategory.en, selectedCategory.hr)}>
                           {selectedCategory.hr} 
                        </span>
                    </>
                )}
                {selectedSubcategory.hr && (
                    <>
                        <span> &nbsp; &gt; </span>
                        <span className="selected-subcategory" onClick={() => handleCategoryClick(selectedCategory.en, selectedCategory.hr, selectedSubcategory.en, selectedSubcategory.hr)}>
                            {selectedSubcategory.hr}
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