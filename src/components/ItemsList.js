import React, { useState } from 'react';
import categories from '../constants/categories';
import './ItemsList.css';

const ItemsList = ({ items, handleLoadMore, currentPage, totalPages, categoryHr, categoryEn }) => {
    const allSubcategories = categories[categoryHr]?.subcategories || [];

    // Price filtering state
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

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
                                    <h5>{categoryHr}</h5>
                                    <ul>
                                        {allSubcategories.map((subcategory, index) => (
                                            <a href={`/items/${categoryEn}/${subcategory.en}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <li key={index} className="custom-bullet-item">{subcategory.hr}</li>
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
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="najmanje" 
                                        value={minPrice} 
                                        onChange={(e) => setMinPrice(e.target.value)} 
                                    />
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="većina" 
                                        value={maxPrice} 
                                        onChange={(e) => setMaxPrice(e.target.value)} 
                                    />
                                    <button className="btn btn-primary" onClick={() => {}}>
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