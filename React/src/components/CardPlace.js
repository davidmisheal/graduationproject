import React, { useState, useEffect } from "react";
import ScreenSize from '../func/ScreenSize'
import { Link } from "react-router-dom";


export default function CardPlace(props) {
  const [image, setImage] = useState(null);
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


  return (
    <>
      <div className="card-rec-hist">
        {image && <img src={image} alt={props.place.img} />}
        <span className="card-rec-hist-writings">
          <h4>{props.place.name}</h4>
          {isMobile ? <p>View More For Details</p> : <p>{props.place.description}</p>}
          <span className="card-buttons">
            <i className="fa-solid fa-heart fa-lg"></i>
          </span>
        </span>
        <span className="button">
          <Link to={`/viewmore/${props.place._id}`}>View More</Link>
        </span>
      </div>
    </>
  );
}
