// src/components/CategoryItems.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemsList from './ItemsList';
import { useParams, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import Navbar from './Navbar';
import categories from '../constants/categories';

const CategoryItems = () => {
    const { category } = useParams();
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedCategory, setSelectedCategory] = useState({ en: '', hr: '' });
    const [selectedSubcategory, setSelectedSubcategory] = useState({ en: '', hr: '' });
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const categoryKey = Object.keys(categories).find(key => categories[key].en === category);
        if (categoryKey) {
            setSelectedCategory({ en: category, hr: categoryKey });
        }
        fetchItems();
    }, [currentPage, category]);

    const fetchItems = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get(`http://localhost:8080/getItems`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { 
                page: currentPage,
                size: pageSize,
                category: category,
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
            <div className="selected-categories">
                {selectedCategory.hr !== '' && (
                    <span 
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer'}}
                        >
                            Početna &nbsp;
                    </span>
                )}
                {selectedCategory.hr && (
                    <>
                        <span> &gt; &nbsp;</span>
                        <span>
                            {selectedCategory.hr}
                        </span>
                    </>
                )}
            </div>
            <ItemsList 
                items={items} 
                handleLoadMore={handleLoadMore} 
                currentPage={currentPage} 
                totalPages={totalPages}
                categoryHr={selectedCategory.hr}
                categoryEn={selectedCategory.en} 
            />
        </div>
    );
};

export default CategoryItems;