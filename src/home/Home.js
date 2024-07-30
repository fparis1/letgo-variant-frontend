import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { ACCESS_TOKEN } from '../constants';

const Home = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.get('http://localhost:8080/getItems', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setItems(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the items: ", error);
        });
    };

    return (
        <div className="home-container">
            <div className="container mt-5">
                <div className="row">
                    {items.map(item => {
                        const base64String = item.photo.data;
                        const mimeType = item.photo.contentType;
                        const itemUrl = `/view-item/${item.id}`;
                        
                        return (
                            <div key={item.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <a href={itemUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <img 
                                            className="card-img-top" 
                                            src={`data:${mimeType};base64,${base64String}`} 
                                            alt={item.photo.fileName} 
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    </a>
                                    <div className="card-body">
                                        <a href={itemUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <h5 className="card-title">{item.title}</h5>
                                        </a>
                                        <p className="card-text">{item.price} <b>€</b></p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Home;