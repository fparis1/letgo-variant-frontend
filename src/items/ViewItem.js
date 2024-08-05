import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import './ViewItem.css';

function ViewItemComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track current image index

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

  if (loading) {
    return <div className="text-center mt-5"><strong>Loading...</strong></div>;
  }

  if (!item) {
    return <div className="alert alert-danger" role="alert">Item not found</div>;
  }

  return (
    <div className="view-item-container">
      <div className="d-flex justify-content-center mt-3">
        <button onClick={() => navigate('/')} className="btn btn-primary">Return to Main Page</button>
      </div>
      <div className="container mt-5">
        <div className="card">
          <div className="card-body">
            <p className="card-text">{item.user.name}</p>
            <p className="card-text">{item.user.email}</p>
            <h2 className="card-title">{item.title}</h2>
            <p className="card-text">{item.description}</p>
            <p className="card-text"><strong>{parseInt(item.price)} €</strong></p>
            <div className="d-flex flex-wrap justify-content-center">
              <div className="image-container">
                <img 
                  src={`data:${item.photos[currentImageIndex].contentType};base64,${item.photos[currentImageIndex].data}`} 
                  alt={item.photos[currentImageIndex].fileName} 
                  className="img-fluid img-thumbnail"
                  style={{ width: '400px', height: 'auto' }}
                />
              </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
              {
                item.photos.length > 1 && (
                  <button onClick={prevImage} className="btn btn-secondary mr-2">Previous</button>
              )}
              {
                item.photos.length > 1 && (
                  <button onClick={nextImage} className="btn btn-secondary ml-2">Next</button>
              )}
            </div>
            <div className="d-flex justify-content-center mt-3">
              <MapContainer center={[item.latitude, item.longitude]} zoom={13} style={{ height: "300px", width: "300px" }}>
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
  );
}

export default ViewItemComponent;