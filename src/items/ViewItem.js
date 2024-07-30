import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ViewItem.css';

function ViewItemComponent() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track current image index

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
      <div className="container mt-5">
        <div className="card">
          <div className="card-body">
            <p className="card-text">{item.user.name}</p>
            <p className="card-text">{item.user.email}</p>
            <h2 className="card-title">{item.title}</h2>
            <p className="card-text">{item.description}</p>
            <p className="card-text"><strong>{item.price} €</strong></p>
            <div className="d-flex flex-wrap justify-content-center">
              <button onClick={prevImage} className="btn btn-secondary mr-2">Previous</button>
              <img 
                src={`data:${item.photos[currentImageIndex].contentType};base64,${item.photos[currentImageIndex].data}`} 
                alt={item.photos[currentImageIndex].fileName} 
                className="img-fluid img-thumbnail"
                style={{ maxHeight: '400px', maxWidth: '100%' }}
              />
              <button onClick={nextImage} className="btn btn-secondary ml-2">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewItemComponent;