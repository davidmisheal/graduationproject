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
    const [selectedPlaces, setSelectedPlaces] = useState([]); // State for selected places
    const isLoggedIn = window.localStorage.getItem('isLoggedIn');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const userData = JSON.parse(window.localStorage.getItem('userData'));
                const response = await axios.get('http://localhost:3000/api/v1/bookings', {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                });
                const bookingData = response.data.data.data;
                setBookings(bookingData);

                // Fetch place details for each booking
                const placeIds = bookingData.flatMap(booking => booking.places);
                const placeResponses = await Promise.all(placeIds.map(id => axios.get(`http://localhost:3000/api/v1/place/${id}`)));
                const placeData = placeResponses.reduce((acc, response) => {
                    acc[response.data.data._id] = response.data.data;
                    return acc;
                }, {});
                setPlaces(placeData);

                // Fetch tour details for each booking
                const tourIds = bookingData.map(booking => booking.tour);
                const tourResponses = await Promise.all(tourIds.map(id => axios.get(`http://localhost:3000/api/v1/tours/${id}`)));
                const tourData = tourResponses.reduce((acc, response) => {
                    acc[response.data.data._id] = response.data.data;
                    return acc;
                }, {});
                setTours(tourData);

                console.log("Booking response:", bookingData);
            } catch (error) {
                console.error("Error fetching bookings, places, or tours:", error);
            }
        };

        fetchBookings();
    }, []);

    const handleAddPlace = (placeId) => {
        const place = places[placeId];
        if (place && !selectedPlaces.some(selectedPlace => selectedPlace._id === place._id)) {
            setSelectedPlaces([...selectedPlaces, place]);
        }
    };

    const handleRemovePlace = (placeId) => {
        setSelectedPlaces(selectedPlaces.filter(place => place._id !== placeId));
    };

    const handleRemoveTrip = async (bookingId) => {
        try {
            const userData = JSON.parse(window.localStorage.getItem('userData'));
            await axios.delete(`http://localhost:3000/api/v1/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            });
            setBookings(bookings.filter(booking => booking._id !== bookingId));
        } catch (error) {
            console.error("Error removing trip:", error);
        }
    };

    const getTotalPrice = () => {
        return selectedPlaces.reduce((total, place) => total + place.price, 0);
    };

    const handleCheckout = () => {
        // Handle checkout logic here
        alert('Proceeding to payment');
    };

    return (
        <>
            <Nav />
            <div className="mytrips">
                <h2 className="mytrips-title">My Trips</h2>
                {
                    isLoggedIn ? bookings.length > 0 ? (
                        <div className="mytrips-body">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="mytrips-element">
                                    {places[booking.places[0]] && places[booking.places[0]].img && (
                                        <img src={require(`../imgs/${places[booking.places[0]].img}`)} alt={places[booking.places[0]].name} />
                                    )}
                                    <div>
                                        <span className="mytrips-element-h4">
                                            <h4>{places[booking.places[0]] ? places[booking.places[0]].name : 'Unknown Place'}</h4>
                                        </span>
                                        <div className="mytrips-element-details">
                                            <span>
                                                <i className="fa-solid fa-location-dot fa-sm"></i>
                                                <p>{places[booking.places[0]] ? places[booking.places[0]].location : 'Unknown Location'}</p>
                                            </span>
                                            <span>
                                                <i className="fa-solid fa-heart fa-sm"></i>
                                                <p>2540</p>
                                            </span>
                                            <span>
                                                <i className="fa-regular fa-calendar fa-sm"></i>
                                                <p>{new Date(booking.date).toLocaleDateString()}</p>
                                            </span>
                                            <span>
                                                <i className="fa-solid fa-user-tie fa-sm"></i>
                                                <p>{tours[booking.tour] && tours[booking.tour].name ? tours[booking.tour].name : 'Unknown Tour Guide'}</p>
                                            </span>
                                            <h5 className="mytrips-element-status">Pending</h5>
                                        </div>
                                    </div>
                                    <div className="mytrips-elements-button">
                                        <span>
                                            <i className="fa-solid fa-money-bill"></i>
                                            <p>{booking.price}</p>
                                        </span>
                                        <button onClick={() => handleAddPlace(booking.places[0])}>Add</button>
                                        <button onClick={() => handleRemoveTrip(booking._id)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : "No trips added yet." :
                        "Sign in first!"
                }
                {selectedPlaces.length > 0 && (
                    <div className="checkout-body">
                        <h3>Checkout</h3>
                        <div className="checkout-details">
                            <ul className="checkout-element">
                                {selectedPlaces.map((place, index) => (<>
                                    <li key={index}>
                                        <p>
                                            {place.name} - {place.price} L.E
                                        </p>
                                        <button onClick={() => handleRemovePlace(place._id)}>Remove</button>
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
            </div>
            <Footer name='footer-main' />
        </>
    );
}
