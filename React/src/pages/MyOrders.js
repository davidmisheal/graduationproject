import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import axios from "axios";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [places, setPlaces] = useState({});
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchBookings = async () => {
            const userData = JSON.parse(
                window.localStorage.getItem("userData") || "{}"
            );
            if (!userData.token) {
                console.error("Authentication token is missing.");
                return;
            }

            console.log("User Data:", userData);
            console.log("Token:", userData.token);
            console.log("Tour ID:", userData.data?.tour?._id);

            if (!userData.data?.tour?._id) {
                console.error("Tour ID is missing.");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:3000/api/v1/bookings/tour/${userData.data.tour._id}`,
                    {
                        headers: { Authorization: `Bearer ${userData.token}` },
                    }
                );

                const allBookings = response.data.data.bookings || [];
                const filteredBookings = allBookings.filter(
                    (booking) => booking.tour.toString() === userData.data.tour._id
                );
                console.log(filteredBookings)
                setOrders(filteredBookings);

                // Fetching places for each booking
                const placeIds = filteredBookings.flatMap((booking) =>
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

                // Fetching users for each booking
                const userIds = filteredBookings.map((booking) => booking.user._id);
                const userResponses = await Promise.all(
                    userIds.map((id) =>
                        axios.get(`http://localhost:3000/api/v1/users/${id}`)
                    )
                );

                const newUsers = userResponses.reduce((acc, response) => {
                    const userData = response.data.data;
                    acc[userData._id] = userData;
                    return acc;
                }, {});
                setUsers(newUsers);

                console.log("Places:", newPlaces);
                console.log("Users:", newUsers);
                console.log("Filtered Bookings:", filteredBookings);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                console.error("Error Response:", error.response);
            }
        };

        fetchBookings();
    }, []);

    const handleAcceptBooking = async (bookingId) => {
        const userData = JSON.parse(
            window.localStorage.getItem("userData") || "{}"
        );
        try {
            await axios.patch(
                `http://localhost:3000/api/v1/bookings/${bookingId}/accept`,
                {},
                {
                    headers: { Authorization: `Bearer ${userData.token}` },
                }
            );
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === bookingId ? { ...order, status: "accepted" } : order
                )
            );
        } catch (error) {
            console.error("Failed to accept booking:", error);
        }
    };

    const handleDeclineBooking = async (bookingId) => {
        const userData = JSON.parse(
            window.localStorage.getItem("userData") || "{}"
        );
        try {
            await axios.patch(
                `http://localhost:3000/api/v1/bookings/${bookingId}/decline`,
                {},
                {
                    headers: { Authorization: `Bearer ${userData.token}` },
                }
            );
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === bookingId ? { ...order, status: "declined" } : order
                )
            );
        } catch (error) {
            console.error("Failed to decline booking:", error);
        }
    };

    return (
        <>
            <Nav />
            <div className="myorders">
                <h2>My Orders</h2>
                <div className="myorders-body">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <>
                                <div key={order._id} className="myorders-element">
                                    <div className="myorders-element-info">
                                        <h3>Booking ID: {order._id}</h3>
                                        <div className="myorders-element-info-user">
                                            <h4>User:</h4>
                                            <p>
                                                {users[order.user._id] ? (
                                                    <>
                                                        {users[order.user._id].name} - {users[order.user._id].email}
                                                    </>
                                                ) : (
                                                    "Loading..."
                                                )}
                                            </p>
                                        </div>
                                        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                                        <p><strong>Price:</strong> {order.price} L.E</p>
                                        <div className="myorders-element-info-place">
                                            <h4>Place:</h4>
                                            <ul>
                                                {order.places.map((place) => (
                                                    <li key={place._id}>
                                                        {places[place._id] ? places[place._id].name : "Loading..."}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <h5>Status:</h5>
                                        <p className="order-status">{order.status}</p>
                                    </div>
                                    <div className="requests-button">
                                        <button onClick={() => handleAcceptBooking(order._id)}>Accept</button>
                                        <button onClick={() => handleDeclineBooking(order._id)}>Decline</button>
                                    </div>
                                </div>
                                <hr />
                            </>
                        ))
                    ) : (
                        <p>No orders found.</p>
                    )}
                </div>
            </div>
            <Footer name="footer-main" />
        </>
    );
}
