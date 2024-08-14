// src/components/SubcategoryItems.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemsList from './ItemsList';
import { useParams, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import categories from '../constants/categories';
import Navbar from './Navbar';

const SubcategoryItems = () => {
    const { category, subcategory } = useParams();
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
            const subcategoryObj = categories[categoryKey].subcategories.find(subcat => subcat.en === subcategory);
            if (subcategoryObj) {
                setSelectedSubcategory(subcategoryObj);
            }
        }
        fetchItems();
    }, [currentPage, category, subcategory]);

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
                subcategory: subcategory
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
            <ItemsList items={items} handleLoadMore={handleLoadMore} currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
};

export default SubcategoryItems;
