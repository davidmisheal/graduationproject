import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useUser } from "../context/UserContext";
import axios from "axios";

export default function MyTrips() {
  const { user, setUser, logout } = useUser();
  const [bookings, setBookings] = useState([]);
  const [places, setPlaces] = useState({});
  const [tours, setTours] = useState({});
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [cancelRequest, setCancelRequest] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelRequestStatus, setCancelRequestStatus] = useState(null);
  const [reviewRequest, setReviewRequest] = useState(null); // New state for review
  const [review, setReview] = useState(""); // New state for review text
  const [rating, setRating] = useState(5); // New state for review rating
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");

  useEffect(() => {
    const fetchBookings = async () => {
      const userData = JSON.parse(
        window.localStorage.getItem("userData") || "{}"
      );
      if (!userData.token) {
        console.error("Authentication token is missing.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/bookings/user/${userData.data.user._id}`,
          { headers: { Authorization: `Bearer ${userData.token}` } }
        );
        console.log("API Response:", response.data);

        const bookingData = response.data.data.bookings || [];
        setBookings(bookingData);

        const placeIds = bookingData.flatMap((booking) =>
          booking.places.map((place) => place._id)
        );
        const placeResponses = await Promise.all(
          placeIds.map((id) =>
            axios.get(`http://localhost:3000/api/v1/place/${id}`, {
              headers: { Authorization: `Bearer ${userData.token}` },
            })
          )
        );

        const newPlaces = placeResponses.reduce((acc, response) => {
          const placeData = response.data.data;
          acc[placeData._id] = placeData;
          return acc;
        }, {});
        setPlaces(newPlaces);

        const tourIds = bookingData.map((booking) => booking.tour._id);
        const tourResponses = await Promise.all(
          tourIds.map((id) =>
            axios.get(`http://localhost:3000/api/v1/tours/${id}`, {
              headers: { Authorization: `Bearer ${userData.token}` },
            })
          )
        );

        const newTours = tourResponses.reduce((acc, response) => {
          acc[response.data.data.data._id] = response.data.data;
          return acc;
        }, {});
        setTours(newTours);
        console.log("Places:", newPlaces);
        console.log("booking:", bookingData);
        console.log("Tours:", newTours[bookings[0].tour._id]);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleAddPlace = (placeId) => {
    const place = places[placeId];
    if (place && !selectedPlaces.some((sp) => sp._id === place._id)) {
      setSelectedPlaces((prev) => [...prev, place]);
    }
  };

  const handleRemovePlace = (placeId) => {
    setSelectedPlaces((prev) => prev.filter((place) => place._id !== placeId));
  };

  const handleRemoveTrip = async (bookingId) => {
    const userData = JSON.parse(
      window.localStorage.getItem("userData") || "{}"
    );
    try {
      await axios.delete(`http://localhost:3000/api/v1/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error("Error removing trip:", error);
    }
  };

  const handleCancelRequest = (bookingId) => {
    setCancelRequest(bookingId);
    setCancelReason("");
  };

  const handleSubmitCancelRequest = async () => {
    const userData = JSON.parse(
      window.localStorage.getItem("userData") || "{}"
    );
    try {
      await axios.post(
        `http://localhost:3000/api/v1/cancellation-requests`,
        { bookingId: cancelRequest, reason: cancelReason },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      alert("Cancel request sends Successfully!");
      setCancelRequestStatus("Request submitted. Waiting for approval.");
      setCancelRequest(null);
    } catch (error) {
      console.error("Error submitting cancel request:", error);
      setCancelRequestStatus("Failed to submit request. Please try again.");
    }
  };

  const getTotalPrice = () => {
    return selectedPlaces.reduce((total, place) => total + place.price, 0);
  };

  const handleCheckout = async () => {
    const userData = JSON.parse(
      window.localStorage.getItem("userData") || "{}"
    );
    try {
      const updatePromises = selectedPlaces.map((place) => {
        const booking = bookings.find(
          (booking) => booking.places[0]._id === place._id
        );
        return axios.patch(
          `http://localhost:3000/api/v1/bookings/${booking._id}`,
          { paid: true, status: "confirmed" },
          {
            headers: { Authorization: `Bearer ${userData.token}` },
          }
        );
      });
      const responses = await Promise.all(updatePromises);
      const updatedBookings = responses.map((res) => res.data.data.booking);

      setBookings((prev) =>
        prev.map(
          (booking) =>
            updatedBookings.find(
              (updatedBooking) => updatedBooking._id === booking._id
            ) || booking
        )
      );
      alert("Payment successful!");
      setSelectedPlaces([]);
      window.location.reload();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };
  const handleReviewRequest = (bookingId) => {
    setReviewRequest(bookingId);
    setReview("");
    setRating(5);
  };

  const handleSubmitReviewRequest = async () => {
    const userData = JSON.parse(
      window.localStorage.getItem("userData") || "{}"
    );
    const booking = bookings.find((booking) => booking._id === reviewRequest);
    if (!booking) {
      alert("Booking not found.");
      return;
    }
    const tourId = booking.tour._id;
    const userId = booking.user._id;

    try {
      await axios.post(
        `http://localhost:3000/api/v1/reviews`,
        {
          review,
          rating,
          tour: tourId,
          user: userId,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      alert("Review submitted successfully!");
      setReviewRequest(null);
    } catch (error) {
      console.error("Error submitting review request:", error);
    }
  };

  const confirmedTrips = bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "finished"
  );
  const pendingTrips = bookings.filter(
    (booking) => booking.status !== "confirmed" && booking.status !== "finished"
  );

  return (
    <>
      <Nav />
      <div className="mytrips">
        <h2 className="mytrips-title">My Trips</h2>
        <div className="mytrips-confirmed">
          {isLoggedIn ? (
            confirmedTrips.length > 0 ? (
              <>
                <h2>Confirmed Trips</h2>
                <div className="mytrips-body">
                  {confirmedTrips.map((booking) => (
                    <div key={booking._id} className="mytrips-element">
                      <h5 className="mytrips-element-status">
                        {booking.status}
                      </h5>
                      {places[booking.places[0]._id] &&
                        places[booking.places[0]._id].img && (
                          <img
                            src={require(`../imgs/${
                              places[booking.places[0]._id].img
                            }`)}
                            alt={places[booking.places[0]._id].name}
                          />
                        )}
                      <div>
                        <span className="mytrips-element-h4">
                          <h4>
                            {places[booking.places[0]._id]
                              ? places[booking.places[0]._id].name
                              : "Unknown Place"}
                          </h4>
                        </span>
                        <div className="mytrips-element-details">
                          <span>
                            <i className="fa-solid fa-location-dot fa-sm"></i>
                            <p>
                              {places[booking.places[0]._id]
                                ? places[booking.places[0]._id].location
                                : "Unknown Location"}
                            </p>
                          </span>
                          <span>
                            <i className="fa-solid fa-heart fa-sm"></i>
                            <p>
                              {places[booking.places[0]._id]
                                ? places[booking.places[0]._id].favoriteCount
                                : "0"}
                            </p>
                          </span>
                          <span>
                            <i className="fa-regular fa-calendar fa-sm"></i>
                            <p>{new Date(booking.date).toLocaleDateString()}</p>
                          </span>
                          <span>
                            <i className="fa-solid fa-user-tie fa-sm"></i>
                            <p>
                              {tours[booking.tour._id] &&
                              tours[booking.tour._id].data.name
                                ? tours[booking.tour._id].data.name
                                : "Unknown Tour Guide"}
                            </p>
                          </span>
                        </div>
                      </div>
                      <div className="mytrips-elements-button">
                        <span>
                          <i className="fa-solid fa-money-bill"></i>
                          <p>{booking.price}</p>
                        </span>
                        <span className="mytrips-element-buttons">
                          {booking.status === "accepted" && (
                            <button
                              onClick={() =>
                                handleAddPlace(booking.places[0]._id)
                              }
                            >
                              Add
                            </button>
                          )}
                          {booking.status === "confirmed" ? (
                            <button
                              onClick={() => handleCancelRequest(booking._id)}
                            >
                              Cancel
                            </button>
                          ) : null}
                          {booking.status === "finished" ? (
                            <button
                              onClick={() => handleReviewRequest(booking._id)}
                              className="mytrips-element-btn"
                            >
                              Review
                            </button>
                          ) : null}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>{" "}
                {reviewRequest && (
                  <div className="review-request-form">
                    <h4>Submit Review</h4>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Enter your review"
                    />
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map((ratingValue) => (
                        <option key={ratingValue} value={ratingValue}>
                          {ratingValue} Star{ratingValue > 1 && "s"}
                        </option>
                      ))}
                    </select>
                    <button onClick={handleSubmitReviewRequest}>Submit</button>
                    <button onClick={() => setReviewRequest(null)}>
                      Close
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="mytrips-off">No confirmed trips.</div>
            )
          ) : (
            "Sign in first!"
          )}
        </div>
        <div className="mytrips-pending">
          {isLoggedIn ? (
            pendingTrips.length > 0 ? (
              <>
                <h2>Pending Trips</h2>
                <div className="mytrips-body">
                  {pendingTrips.map((booking) => (
                    <div key={booking._id} className="mytrips-element">
                      <h5 className="mytrips-element-status">
                        {booking.status}
                      </h5>
                      {places[booking.places[0]._id] &&
                        places[booking.places[0]._id].img && (
                          <img
                            src={require(`../imgs/${
                              places[booking.places[0]._id].img
                            }`)}
                            alt={places[booking.places[0]._id].name}
                          />
                        )}
                      <div>
                        <span className="mytrips-element-h4">
                          <h4>
                            {places[booking.places[0]._id]
                              ? places[booking.places[0]._id].name
                              : "Unknown Place"}
                          </h4>
                        </span>
                        <div className="mytrips-element-details">
                          <span>
                            <i className="fa-solid fa-location-dot fa-sm"></i>
                            <p>
                              {places[booking.places[0]._id]
                                ? places[booking.places[0]._id].location
                                : "Unknown Location"}
                            </p>
                          </span>
                          <span>
                            <i className="fa-solid fa-heart fa-sm"></i>
                            <p>
                              {places[booking.places[0]._id]
                                ? places[booking.places[0]._id].favoriteCount
                                : "0"}
                            </p>
                          </span>
                          <span>
                            <i className="fa-regular fa-calendar fa-sm"></i>
                            <p>{new Date(booking.date).toLocaleDateString()}</p>
                          </span>
                          <span>
                            <i className="fa-solid fa-user-tie fa-sm"></i>
                            <p>
                              {tours[booking.tour._id] &&
                              tours[booking.tour._id].data.name
                                ? tours[booking.tour._id].data.name
                                : "Unknown Tour Guide"}
                            </p>
                          </span>
                        </div>
                      </div>
                      <div className="mytrips-elements-button">
                        <span>
                          <i className="fa-solid fa-money-bill"></i>
                          <p>{booking.price}</p>
                        </span>
                        <span className="mytrips-element-buttons">
                          {booking.status === "accepted" && (
                            <button
                              onClick={() =>
                                handleAddPlace(booking.places[0]._id)
                              }
                            >
                              Add
                            </button>
                          )}
                          <button onClick={() => handleRemoveTrip(booking._id)}>
                            Remove
                          </button>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mytrips-off">No pending trips.</div>
            )
          ) : (
            "Sign in first!"
          )}
        </div>
        {selectedPlaces.length > 0 && (
          <div className="checkout-body">
            <h3>Checkout</h3>
            <div className="checkout-details">
              <ul className="checkout-element">
                {selectedPlaces.map((place, index) => (
                  <>
                    <li key={index}>
                      <p>
                        {place.name} - {place.price} L.E
                      </p>
                      <button onClick={() => handleRemovePlace(place._id)}>
                        Remove
                      </button>
                    </li>
                    <hr />
                  </>
                ))}
              </ul>
              <div className="checkout-total">
                <h4>Total: {getTotalPrice()} L.E</h4>
                <button onClick={handleCheckout}>Pay</button>
              </div>
            </div>
          </div>
        )}
        {cancelRequest && (
          <>
            <div className="cancel-overlay"></div>
            <div className="cancel-request-form">
              <h3>Request Trip Cancellation</h3>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation"
              />
              <span>
                <button onClick={handleSubmitCancelRequest}>Submit</button>
                <button onClick={() => setCancelRequest(null)}>Cancel</button>
              </span>
              {cancelRequestStatus && <p>{cancelRequestStatus}</p>}
            </div>
          </>
        )}
      </div>
      <Footer name="footer-main" />
    </>
  );
}
