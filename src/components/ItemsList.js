// src/components/ItemsList.js
import React from 'react';

const ItemsList = ({ items, handleLoadMore, currentPage, totalPages }) => {
    return (
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
    );
};

export default ItemsList;
