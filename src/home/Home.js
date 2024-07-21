import React, { Component } from 'react';
import axios from 'axios';
import './Home.css';
import { ACCESS_TOKEN } from '../constants';

class Home extends Component {
    state = {
        items: [] // Initialize items array in state
    };

    componentDidMount() {
        this.fetchItems();
    }

    fetchItems = () => {
        const token = localStorage.getItem(ACCESS_TOKEN); // Retrieve token from local storage
        axios.get('http://localhost:8080/getItems', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            this.setState({ items: response.data });
        })
        .catch(error => {
            console.error("There was an error fetching the items: ", error);
        });
    };

    render() {
        return (
            <div className="home-container">
                <div className="container mt-5">
                    {/* <div className="graf-bg-container">
                        <div className="graf-layout">
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                        </div>
                    </div>
                    <h1 className="home-title">Spring Boot React OAuth2 Social Login Demo</h1> */}
                    <div className="row">
                        {this.state.items.map(item => {
                            const base64String = item.photo.data;
                            const mimeType = item.photo.contentType;
                            const itemUrl = `/view-item/${item.id}`;
                            
                            return (
                                <div key={item.id} className="col-md-4 mb-4">
                                    <div className="card h-100"> {/* Use h-100 to make cards of equal height */}
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
    }
}

export default Home;
