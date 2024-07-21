import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ViewItem.css';

function ViewItemComponent() {
  const { id } = useParams(); // Extracting the id parameter from the URL
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for fetching item details from the backend
    // Replace 'http://example.com/api/items/' with your actual backend URL
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
  }, [id]); // Dependency array to re-run the effect if the id changes

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
            <h2 className="card-title">{item.title}</h2>
            <p className="card-text">{item.description}</p>
            <p className="card-text"><strong>{item.price} €</strong></p>
            <div className="d-flex flex-wrap">
              {item.photos.map((photo, index) => (
                <img 
                  key={index}
                  src={`data:${photo.contentType};base64,${photo.data}`} 
                  alt={photo.fileName} 
                  className="img-fluid img-thumbnail m-2"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewItemComponent;