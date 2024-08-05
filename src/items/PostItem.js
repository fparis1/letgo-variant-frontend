import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import './PostItem.css';
import { ACCESS_TOKEN, USER_EMAIL } from '../constants';
import categories from '../constants/categories';
import regions from '../constants/regions';

const PostItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [settlement, setSettlement] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [location, setLocation] = useState([45.788175, 15.96038]); // Default location

  const navigate = useNavigate();

  const defaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  L.Marker.prototype.options.icon = defaultIcon;

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

  const handleCountyChange = (event) => {
    setCounty(event.target.value);
    setCity('');
    setSettlement('');
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
    setSettlement('');
  };

  const handleSettlementChange = (event) => {
    setSettlement(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category.en);
    formData.append('subcategory', subcategory.en);
    formData.append('county', county);
    formData.append('city', city);
    formData.append('settlement', settlement);
    formData.append('latitude', location[0]);
    formData.append('longitude', location[1]);
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

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLocation([e.latlng.lat, e.latlng.lng]);
      },
    });

    return location === null ? null : (
      <Marker position={location} icon={defaultIcon}></Marker>
    );
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
        <select className="post-item-select" name="county" onChange={handleCountyChange} required>
          <option value="">Select County</option>
          {Object.keys(regions).map((county) => (
            <option key={county} value={county}>{county}</option>
          ))}
        </select>
        {county && regions[county] && (
          <select className="post-item-select" name="city" onChange={handleCityChange} required>
            <option value="">Select City</option>
            {Object.keys(regions[county].cities).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        )}
        {city && regions[county].cities[city] && (
          <select className="post-item-select" name="settlement" onChange={handleSettlementChange} required>
            <option value="">Select Settlement</option>
            {regions[county].cities[city].map((settlement) => (
              <option key={settlement} value={settlement}>{settlement}</option>
            ))}
          </select>
        )}
        <input className="post-item-file-input" type="file" multiple onChange={handleFileChange} required />
        <MapContainer center={location} zoom={13} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
        <button className="post-item-submit-btn" type="submit">Post Item</button>
      </form>
    </div>
  );
};

export default PostItem;