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
        axios.get('http://localhost:8080/getItem', {
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
                <div className="container">
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
                    <div className="items-list">
                        {this.state.items.map(item => {

                            const base64String = item.photo.data;
                            const mimeType = item.photo.contentType;

                            return (
                                <div key={item.id} className="item">
                                    <div className="photos">
                                        <img 
                                            key={item.photo.id} 
                                            src={`data:${mimeType};base64,${base64String}`} 
                                            alt={item.photo.fileName} 
                                            style={{ maxWidth: '300px', maxHeight: '300px' }}
                                        />
                                    </div>
                                    <h2>{item.title}</h2>
                                    <p>{item.price}</p>
                                </div>
                                );

                            return (
                                <div key={item.id} className="item">
                                    <h2>{item.title}</h2>
                                    <p>{item.description}</p>
                                    <p>{item.price}</p>
                                    <div className="photos">
                                        <p>No photo available</p>
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
