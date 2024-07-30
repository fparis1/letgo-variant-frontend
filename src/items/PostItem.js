import React, { useState } from 'react';
import './PostItem.css';
import { ACCESS_TOKEN, USER_EMAIL } from '../constants';

const PostItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'title') setTitle(value);
    if (name === 'description') setDescription(value);
    if (name === 'price') setPrice(value);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type === "image/jpeg" || file.type === "image/png");

    if (validFiles.length !== files.length) {
      alert("Only JPEG and PNG files are allowed.");
    } else {
      setPhotos(validFiles);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    photos.forEach((photo) => {
      formData.append('file', photo);
    });
    formData.append('email', localStorage.getItem(USER_EMAIL));

    const token = localStorage.getItem(ACCESS_TOKEN);

    fetch('http://localhost:8080/postItem', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
    .then(data => {
      console.log('Success:', data);
      alert('Item posted successfully!');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="post-item-container">
      <h2 className="post-item-title">Post an Item for Sale</h2>
      <form className="post-item-form" onSubmit={handleSubmit}>
        <input className="post-item-input" type="text" name="title" placeholder="Title" onChange={handleInputChange} required />
        <textarea className="post-item-textarea" name="description" placeholder="Description" onChange={handleInputChange} required></textarea>
        <input className="post-item-input" type="number" name="price" placeholder="Price" onChange={handleInputChange} required />
        <input className="post-item-file-input" type="file" multiple onChange={handleFileChange} />
        <button className="post-item-submit-btn" type="submit">Post Item</button>
      </form>
    </div>
  );
};

export default PostItem;