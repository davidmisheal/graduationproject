import React, { useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useUser } from "../context/UserContext";
import { useLocation } from "react-router-dom";

export default function MyTrips() {
    const location = useLocation()
    const { state } = location;
    const { user, setUser, logout } = useUser();
    const isLoggedIn =window.localStorage.getItem('isLoggedIn')

    return (
        <>
            <Nav />
            <div className="mytrips">
                <h2 className="mytrips-title">My Trips</h2>
                {
                    isLoggedIn ? state ? (
                        <div className="mytrips-body">
                                <div className="mytrips-element">
                                    <img src={require (`../imgs/${state.img}`)}/>
                                    <div>
                                        <h4>{state.name}</h4>
                                        <p>{state.location}</p>
                                        <p>Price : {state.price} L.E</p>
                                    </div>
                                    <div>
                                        <h5>Status</h5>
                                        <p>Pending</p>
                                    </div>
                                    <div>
                                        <h5>Trip Date</h5>
                                        <p>25 dec 2024</p>
                                    </div>
                                </div>
                        </div>
                    ) : "No trips added yet." :
                        "sign in first!"

                }
            </div>
            <Footer name='footer-main' />
        </>
    )
}