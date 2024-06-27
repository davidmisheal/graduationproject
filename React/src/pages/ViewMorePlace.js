import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ViewMore() {
  const { id } = useParams(); // Get the place ID from the URL
  const [place, setPlace] = useState(null);
  const [image, setImage] = useState(null);
  const [tours, setTours] = useState([]); // Initialize as an empty array
  const [showTours, setShowTours] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [bookedTourGuide, setBookedTourGuide] = useState(null); // State to store the booked tour guide
  const [selectedDate, setSelectedDate] = useState(null); // State for the selected date
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaceById = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/place/${id}`);
        if (response.data && response.data.data) {
          setPlace(response.data.data); // Ensure this matches your API response structure
          console.log("Fetched place:", response.data.data);
        } else {
          console.error("Invalid response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };

    fetchPlaceById();
  }, [id]);

  useEffect(() => {
    if (place && place.img) {
      const loadImage = async () => {
        try {
          const imgModule = await import(`../imgs/${place.img}`);
          setImage(imgModule.default);
        } catch (error) {
          console.error("Error loading image:", error);
        }
      };

      loadImage();
    }
  }, [place]);

  const handleAddToTrip = async () => {
    const userData = JSON.parse(window.localStorage.getItem('userData'));
    if (!userData || !userData.token) {
      console.error("User data or token is missing");
      return;
    }

    const tourPrice = bookedTourGuide ? bookedTourGuide.price : 0;
    const totalPrice = place.price + tourPrice;

    try {
      const bookingDetails = await axios.post('http://localhost:3000/api/v1/bookings', {
        tour: bookedTourGuide ? bookedTourGuide._id : null,
        places: place ? [place._id] : [], // Ensure places is an array of place IDs
        date: selectedDate,
        price: totalPrice
      }, {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
      console.log("Booking response:", bookingDetails);
      navigate('/mytrips', { state: place });
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handlePickTourGuide = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/tours');
      const toursData = response.data.data.data || [];

      // Check if place.location exists and is a string
      if (!place || !place.location || typeof place.location !== 'string') {
        console.error("Invalid place location:", place.location);
        return;
      }

      const placeLocationLower = place.location.toLowerCase();

      const filteredTours = toursData.filter((tour) => {
        // Check if tour.location exists and is a string
        if (!tour.location || typeof tour.location !== 'string') {
          console.error("Invalid tour location:", tour.location);
          return false;
        }
        return tour.location.toLowerCase() === placeLocationLower;
      });

      setTours(filteredTours); // Set the filtered tours to state
      setShowTours(true); // Show the tours
      setIsVisible(true); // Make the tour guide list visible
      console.log("Filtered tours:", filteredTours);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  const handleBookTourGuide = (tour) => {
    setBookedTourGuide(tour);
    console.log("Booked tour guide:", tour);
  };

  if (!place) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Nav />
      <div className="viewmore">
        <div className="viewmore-first visible">
          <div className="viewmore-first-img">
            <img src={image} alt={place.name} />
          </div>
          <div className="viewmore-first-overlay">
            <span className="viewmore-first-overlay-details">
              <h2>{place.name}</h2>
              <p>{place.location}</p>
            </span>
            <span className="viewmore-first-overlay-counters">
              <i className="fa-solid fa-location-dot fa-xl"></i> <p>1000</p> | <i className="fa-solid fa-heart fa-xl"></i> <p>{place.favoriteCount}</p>
            </span>
          </div>
        </div>
        <div className="viewmore-second">
          <div className="viewmore-second-left visible">
            <h2>Description</h2>
            <p className="viewmore-second-desc">
              {place.description}
            </p>
            <p className="viewmore-second-desc">
              {place.description2}
            </p>
            <p className="viewmore-second-desc">
              {place.description3}
            </p>
          </div>
          <div className="viewmore-second-right visible">
            <div>
              <img src={require('../imgs/khan-el-khalili1.jpg')} alt="Khan El Khalili" />
            </div>
            <div>
              <img src={require('../imgs/Khan-El-Khalili2.jpg')} alt="Khan El Khalili" />
            </div>
            <div>
              <img src={require('../imgs/khan3.jpg')} alt="Khan El Khalili" />
            </div>
          </div>
        </div>
        <div className="viewmore-third visible">
          <h3> Price : {place.price}</h3>
          <span>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select a date"
              className="datepicker-input"
            />
            <button className="button-28" role="button" onClick={handlePickTourGuide}>Pick a TourGuide</button>
          </span>
        </div>
        {showTours && (
          <div className={`tour-guide-list ${isVisible ? 'scale-in' : ''}`}>
            <h3>Select a Tour Guide</h3>
            <div className="filtertour-body">
              {tours.length > 0 ? (
                tours.map((tour) => (
                  <React.Fragment key={tour._id}>
                    <hr />
                    <div className="filtertour-element">
                      <div>
                        <h4>{tour.name}</h4>
                        <p className="requests-email">{tour.email}</p>
                        <p className="requests-price">Price: <strong>{tour.price} L.E</strong></p>
                      </div>
                      <div>
                        <h5>Location:</h5>
                        <p className="requests-status">{tour.location}</p>
                      </div>
                      <div className="requests-button">
                        <button onClick={() => handleBookTourGuide(tour)}>Book</button>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <p>No tours available</p>
              )}
            </div>
          </div>
        )}
        <button className="button-28" role="button" onClick={handleAddToTrip}>Add</button>
      </div>
      <Footer name='footer-main' />
    </>
  );
}
