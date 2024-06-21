import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Requests() {
    const [pending, setPending] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedData = localStorage.getItem("userData");
                if (!storedData) {
                    console.error("No user data found in localStorage.");
                    return;
                }

                const parsedData = JSON.parse(storedData);
                if (!parsedData.token || !parsedData.data || !parsedData.data.user) {
                    console.error("Invalid user data structure in localStorage.");
                    return;
                }

                const { token, data: { user } } = parsedData;

                if (user.role !== "admin") {
                    console.error("Unauthorized: Only admins can fetch pending tours");
                    return;
                }

                const response = await axios.get("http://localhost:3000/api/v1/tours/pending-tours", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPending(response.data.data.pendingTours);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleApprove = async (tourId) => {
        try {
            const storedData = localStorage.getItem("userData");
            if (!storedData) {
                console.error("No user data found in localStorage.");
                return;
            }

            const parsedData = JSON.parse(storedData);
            const { token } = parsedData;

            const response = await axios.patch(`http://localhost:3000/api/v1/tours/approve-tour/${tourId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') {
                setPending(pending.map(tour => tour._id === tourId ? { ...tour, approved: true } : tour));
            }
        } catch (error) {
            console.error("Error approving tour:", error);
        }
    };

    return (
        <>
            <Nav />
            <div className="requests">
                <h2>My Requests</h2>
                <div className="requests-body">
                    {pending && pending.map((tour) => (
                        <React.Fragment key={tour._id}>
                            <hr />
                            <div className="requests-element">
                                <div>
                                    <h4>{tour.name}</h4>
                                    <p className="requests-email">{tour.email}</p>
                                    <p className="requests-price">Price: <strong>{tour.price} L.E</strong></p>
                                </div>
                                <div>
                                    <h5>Approved:</h5>
                                    <p className="requests-status">{!tour.approved ? 'Pending' : 'Approved'}</p>
                                </div>
                                <div className="requests-button">
                                    <button onClick={() => handleApprove(tour._id)}>Approve</button>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <Footer name="footer-main" />
        </>
    );
}
