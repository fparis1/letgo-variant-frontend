// Import the CSS file here
import React, { Component } from 'react';
import './PostItem.css';
import { ACCESS_TOKEN } from '../constants';

class PostItem extends Component {
  state = {
    title: '',
    description: '',
    price: '',
    photos: [],
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type === "image/jpeg" || file.type === "image/png");
  
    if (validFiles.length !== files.length) {
      alert("Only JPEG and PNG files are allowed.");
    } else {
      this.setState({ photos: validFiles });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
  
    // Create a FormData object
    const formData = new FormData();
    
    // Append form fields to the FormData object
    formData.append('title', this.state.title);
    formData.append('description', this.state.description);
    formData.append('price', this.state.price);
    
    // Append files to the FormData object
    this.state.photos.forEach((photo) => {
        formData.append('file', photo);
    });
  
    // Get the bearer token from localStorage
    const token = localStorage.getItem(ACCESS_TOKEN);
  
    // Use fetch to send the FormData object to your backend
    fetch('http://localhost:8080/postItem', {
      method: 'POST',
      body: formData,
      headers: {
        // Include the Authorization header with the bearer token
        'Authorization': `Bearer ${token}`
      },
      // Note: When using FormData, you should not set the Content-Type header manually
      // The browser will set it to multipart/form-data and include the boundary parameter automatically
    })
    .then(data => {
      console.log('Success:', data);
      // Handle success response
      // You might want to clear the form or redirect the user
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle errors here
    });
  };

  render() {
    return (
      <div className="post-item-container">
        <h2 className="post-item-title">Post an Item for Sale</h2>
        <form className="post-item-form" onSubmit={this.handleSubmit}>
          <input className="post-item-input" type="text" name="title" placeholder="Title" onChange={this.handleInputChange} required />
          <textarea className="post-item-textarea" name="description" placeholder="Description" onChange={this.handleInputChange} required></textarea>
          <input className="post-item-input" type="number" name="price" placeholder="Price" onChange={this.handleInputChange} required />
          <input className="post-item-file-input" type="file" multiple onChange={this.handleFileChange} />
          <button className="post-item-submit-btn" type="submit">Post Item</button>
        </form>
      </div>
    );
  }
}

export default PostItem;