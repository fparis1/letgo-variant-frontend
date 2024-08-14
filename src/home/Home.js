import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Navbar from '../components/Navbar';
import ItemsList from '../components/ItemsList';

const Home = () => {
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState({ en: '', hr: '' });
    const [selectedSubcategory, setSelectedSubcategory] = useState({ en: '', hr: '' });
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

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
    
        // Navigate after state updates
        if (subcategoryEn !== '') {
            navigate(`/items/${categoryEn}/${subcategoryEn}`);
        } else {
            navigate(`/items/${categoryEn}`);
        }
    };

    return (
        <div className='container home-container'>
            <Navbar
                handleCategoryClick={handleCategoryClick}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
            />
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
            <ItemsList items={items} handleLoadMore={handleLoadMore} currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
};

export default Home;