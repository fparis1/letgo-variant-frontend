import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostItem.css';
import { ACCESS_TOKEN, USER_EMAIL } from '../constants';
import categories from '../constants/categories';

const PostItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

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
    formData.append('category', category.en);
    formData.append('subcategory', subcategory.en);
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
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/');
      }, 3000); // Hide popup and redirect after 3 seconds
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="post-item-container">
      {showPopup && (
        <div className="popup">
          Item posted successfully!
        </div>
      )}
      <h2 className="post-item-title">Post an Item for Sale</h2>
      <form className="post-item-form" onSubmit={handleSubmit}>
        <input className="post-item-input" type="text" name="title" placeholder="Title" onChange={handleInputChange} required />
        <textarea className="post-item-textarea" name="description" placeholder="Description" onChange={handleInputChange} required></textarea>
        <input className="post-item-input" type="number" name="price" placeholder="Price" onChange={handleInputChange} required />
        <select className="post-item-select" name="category" onChange={(e) => setCategory(categories[e.target.value])} required>
          <option value="">Select Category</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {category && category.subcategories && (
          <select className="post-item-select" name="subcategory" onChange={(e) => setSubcategory(category.subcategories.find(subcat => subcat.hr === e.target.value))} required>
            <option value="">Select Subcategory</option>
            {category.subcategories.map((subcat) => (
              <option key={subcat.hr} value={subcat.hr}>{subcat.hr}</option>
            ))}
          </select>
        )}
        <input className="post-item-file-input" type="file" multiple onChange={handleFileChange} />
        <button className="post-item-submit-btn" type="submit">Post Item</button>
      </form>
    </div>
  );
};

export default PostItem;