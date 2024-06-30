import React from "react";
import ScreenSize from "../func/ScreenSize";

function TourGuide({ tour }) {
  const isMobile = ScreenSize();
  // Directly use the image URL provided, assuming it will always be valid
  const imageSrc = tour.imageCover ? `http://localhost:3000/images/${tour.imageCover}` : "";

  return (
    <div className="info-button">
      <div className="info-button-left">
        <img
          src={imageSrc}
          alt={tour.name}
        // Remove onError handler to avoid setting a default image
        />
        <span className="tour-info">
          <span className="info-span">
            <p className="info-title">Name</p>
            <p className="info-details">{tour.name}</p>
          </span>
          <span className="info-span">
            <p className="info-title">Email</p>
            <p className="info-details">{tour.email}</p>
          </span>
          <span className="info-span">
            <p className="info-title">Location</p>
            <p className="info-details">{tour.location}</p>
          </span>
          <span className="info-span">
            <p className="info-title">Price</p>
            <p className="info-details">{tour.price}</p>
          </span>
          <span className="info-ratings">
            <i class="fa-solid fa-star fa-xs"></i>
            <p>{tour.ratingsAverage} ({tour.ratingsQuantity})
            </p>
          </span>
        </span>
      </div>
    </div>
  );
}

export default TourGuide;
