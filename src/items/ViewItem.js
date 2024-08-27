import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import categories from '../constants/categories';
import './ViewItem.css';

function ViewItemComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState({ en: '', hr: '' });
  const [selectedSubcategory, setSelectedSubcategory] = useState({ en: '', hr: '' });

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

  useEffect(() => {
    fetch(`http://localhost:8080/getSpecificItem/${id}`)
      .then(response => response.json())
      .then(data => {
        setItem(data);
        const categoryHR = Object.keys(categories).find(key => categories[key].en === data.category);
        const subcategoryObj = categories[categoryHR].subcategories.find(subcat => subcat.en === data.subcategory);
        setSelectedCategory({ en: data.category, hr: categoryHR});
        setSelectedSubcategory(subcategoryObj);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching item details:', error);
        setLoading(false);
      });
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === item.photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? item.photos.length - 1 : prevIndex - 1
    );
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return <div className="text-center mt-5"><strong>Loading...</strong></div>;
  }

  if (!item) {
    return <div className="alert alert-danger" role="alert">Item not found</div>;
  }

  return (
    <div className="view-item-container container mt-5">
      <div className="row mb-3">
        <div className="selected-categories">
            {selectedCategory.hr !== '' && (
                <span 
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer'}}
                    >
                        Početna &nbsp;
                </span>
            )}
            {selectedCategory.hr && (
                <>
                    <span> &gt; &nbsp;</span>
                    <span 
                          onClick={() => navigate(`/items/${selectedCategory.en}`)}
                          style={{ cursor: 'pointer'}}
                        >
                            {selectedCategory.hr} &nbsp;
                    </span>
                </>
            )}
            {selectedSubcategory.hr && (
                <>
                    <span> &gt; &nbsp;</span>
                    <span 
                          onClick={() => navigate(`/items/${selectedCategory.en}/${selectedSubcategory.en}`)}
                          style={{ cursor: 'pointer'}}
                        >
                            {selectedSubcategory.hr}
                    </span>
                </>
            )}
            {selectedSubcategory.hr && (
                <>
                    <span>&nbsp; &gt; &nbsp;</span>
                    <span 
                        >
                            {item.title}
                    </span>
                </>
            )}
        </div>
      </div>
      <div className="row">
        {/* Left Column: Image */}
        <div className="col-md-8">
          <div className="card">
            <div className="image-container position-relative">
              <img 
                src={`data:${item.photos[currentImageIndex].contentType};base64,${item.photos[currentImageIndex].data}`} 
                alt={item.photos[currentImageIndex].fileName} 
                className="img-fluid"
              />
              {item.photos.length > 1 && (
                <>
                  <button onClick={prevImage} className="btn btn-primary position-absolute" style={{ top: '50%', left: '10px' }}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button onClick={nextImage} className="btn btn-primary position-absolute" style={{ top: '50%', right: '10px' }}>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>
            <div className="image-scrollbar mt-3 d-flex overflow-auto">
              {item.photos.map((photo, index) => (
                <img 
                  key={index}
                  src={`data:${photo.contentType};base64,${photo.data}`} 
                  alt={photo.fileName} 
                  className={`img-thumbnail mx-1 ${index === currentImageIndex ? 'border border-primary' : ''}`}
                  style={{ width: '100px', cursor: 'pointer' }}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column: Item Details */}
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h3 className="card-title"><strong>{parseInt(item.price)} €</strong></h3>
              <p className="card-subtitle mb-2 text-muted">{item.title}</p>
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body text-center">
              <img 
                src="path/to/user/profile/picture" 
                alt="User" 
                className="rounded-circle mb-2"
                style={{ width: '50px', height: '50px' }}
              />
              <h5 className="card-title">{item.user.name}</h5>
              <p className="card-text">{item.user.email}</p>
              <button className="btn btn-danger btn-block">Contact Seller</button>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Lokacija oglasa</h4>
              <p className="text-left">{item.settlement}, {item.city}, {item.county}</p>
              <div className="map-container">
                <MapContainer center={[item.latitude, item.longitude]} zoom={13} style={{ height: "200px", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {item.radius ? (
                    <Circle center={[item.latitude, item.longitude]} radius={1000} />
                  ) : (
                    <Marker position={[item.latitude, item.longitude]} icon={defaultIcon}></Marker>
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewItemComponent;