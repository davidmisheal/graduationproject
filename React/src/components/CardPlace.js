import React, { useState, useEffect } from "react";
import ScreenSize from '../func/ScreenSize';
import { Link } from "react-router-dom";
import axios from "axios";

export default function CardPlace(props) {
  const [image, setImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // New state to handle favorite status
  const isMobile = ScreenSize();

  useEffect(() => {
    const loadImage = async () => {
      try {
        const imgModule = await import(`../imgs/${props.place.img}`);
        setImage(imgModule.default);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    loadImage();
  }, [props.place.img]);

  
  const handleAddToFavorites = async () => {
    try {
      const userData = JSON.parse(window.localStorage.getItem('userData')); // Get the token from local storage
      const response = await axios.post('http://localhost:3000/api/v1/users/favorites', {
        placeId: props.place._id
      }, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        withCredentials: true // Ensure cookies are sent with the request
      });
      if (response.data.status === 'success') {
        setIsFavorite(true); // Update the favorite status
        console.log('Place added to favorites');
      }
    } catch (error) {
      console.error('Error adding place to favorites:', error);
    }
  };

  return (
    <>
      <div className="card-rec-hist">
        {image && <img src={image} alt={props.place.img} />}
        <span className="card-rec-hist-writings">
          <h4>{props.place.name}</h4>
          {isMobile ? <p>View More For Details</p> : <p>{props.place.description}</p>}
          <span className="card-buttons">
            <i 
              className={`fa-solid fa-heart fa-lg ${isFavorite ? 'favorite' : ''}`} // Add a class for styling if needed
              onClick={handleAddToFavorites}
              style={{ cursor: 'pointer' }}
            ></i>
          </span>
        </span>
        <span className="button">
          <Link to={`/viewmore/${props.place._id}`}>View More</Link>
        </span>
      </div>
    </>
  );
}
