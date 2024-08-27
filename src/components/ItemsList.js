import React, { useState } from 'react';
import categories from '../constants/categories';
import './ItemsList.css';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const ItemsList = ({ items, handleLoadMore, currentPage, totalPages, categoryHr, categoryEn, subcategoryHr, subcategoryEn }) => {
    const allSubcategories = categories[categoryHr]?.subcategories || [];

    // Price filtering state
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000000]);

    // Filter items by price
    const filteredItems = items.filter(item => {
        const itemPrice = parseInt(item.price, 10);
        const min = minPrice ? parseInt(minPrice, 10) : 0;
        const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;
        return itemPrice >= min && itemPrice <= max;
    });

    function getClassName(allSubcategories) {
        if (allSubcategories.length === 0) {	
            return "col-md-12";
        } else {
            return "col-md-9";
        }
    }

    function getClassName2(allSubcategories) {
        if (allSubcategories.length === 0) {	
            return "col-md-3 mb-4";
        } else {
            return "col-md-4 mb-4";
        }
    }

    const applyPriceFilter = () => {
        setMinPrice(priceRange[0]);
        setMaxPrice(priceRange[1]);
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {allSubcategories.length > 0 &&
                    <div className="col-md-3 mb-4">
                        <div className="sticky-top">
                            <div className="filter-section">
                                <div className="accordion-header">
                                    Kategorije
                                </div>
                                <div className="accordion-body">
                                    <a 
                                        href={`/items/${categoryEn}`} 
                                        style={{ 
                                            textDecoration: 'none', 
                                            color: 'inherit', 
                                            fontWeight: subcategoryHr === undefined ? 'bold' : 'normal' 
                                        }}
                                    >
                                        {categoryHr}
                                    </a>
                                    <ul>
                                        {allSubcategories.map((subcategory, index) => (
                                            <a 
                                                href={`/items/${categoryEn}/${subcategory.en}`} 
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                <li 
                                                    key={index} 
                                                    className="custom-bullet-item" 
                                                    style={{ fontWeight: subcategory.hr === subcategoryHr ? 'bold' : 'normal' }}
                                                >
                                                    {subcategory.hr}
                                                </li>
                                            </a>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="filter-section">
                                <div className="accordion-header">
                                    Cijena
                                </div>
                                <div className="accordion-body">
                                    <Slider
                                        range
                                        min={0}
                                        max={10000000} // Adjust the max value as needed
                                        value={priceRange}
                                        onChange={setPriceRange}
                                    />
                                    <div className="d-flex justify-content-between mt-2">
                                        <span>{priceRange[0]} €</span>
                                        <span>{priceRange[1]} €</span>
                                    </div>
                                    <button className="btn btn-primary" onClick={applyPriceFilter}>
                                        Primijeni
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <div className={getClassName(allSubcategories)}>
                    <div className="row">
                        {filteredItems.map(item => {
                            const base64String = item.photo.data;
                            const mimeType = item.photo.contentType;
                            const itemUrl = `/view-item/${item.id}`;
                            
                            return (
                                <div key={item.id} className={getClassName2(allSubcategories)}>
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
        </div>
    );
};

export default ItemsList;