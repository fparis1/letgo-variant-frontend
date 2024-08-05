import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { ACCESS_TOKEN } from '../constants';

const Home = () => {
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(1);

    useEffect(() => {
        fetchItems();
    }, [currentPage]);

    const fetchItems = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get('http://localhost:8080/getItems', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { 
                page: currentPage,
                size: pageSize
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

    return (
        <div className="home-container">
            <div className="container mt-5">
                <div className="d-flex justify-content-center mt-4">
                </div>
                <div className="row">
                    {items.map(item => {
                        const base64String = item.photo.data;
                        const mimeType = item.photo.contentType;
                        const itemUrl = `/view-item/${item.id}`;
                        
                        return (
                            <div key={item.id} className="col-md-3 mb-3">
                                <a href={itemUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card h-100">
                                        <img 
                                            className="card-img-top" 
                                            src={`data:${mimeType};base64,${base64String}`} 
                                            alt={item.photo.fileName} 
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text">{item.price} <b>€</b></p>
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