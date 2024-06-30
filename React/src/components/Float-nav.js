import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { useTour } from '../context/TourContext';
import { useEffect } from 'react';

function BottomNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate()
    const { user, userLogout } = useUser();
    const { Tour, tourLogout } = useTour()
    const [role, setRole] = useState('');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const userData = JSON.parse(window.localStorage.getItem('userData'));
        if (userData && userData.data) {
            if (userData.data.user) {
                setRole(userData.data.user.role);
            }
            else if (userData.data.tour) {
                setRole(userData.data.tour.role);
            }
        }
    }, []);


    const handleLogout = () => {
        console.log("Logging out", role);
        if (role === 'user' || role === 'admin') {
            userLogout();
        } else if (role === 'tourguide') {
            tourLogout();
        }
        // Clear local storage and reload the page to ensure state is fully reset
        window.localStorage.removeItem('userData');
        window.localStorage.setItem('isLoggedIn', false);
        window.location.reload();
        navigate("/")
    };

    return (
        <nav className="navbar-bottom">
            <div className="menu-button" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#343a40" className="bi bi-list" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                </svg>
                <p>Menu</p>
            </div>
            <ul className={isMenuOpen ? "nav-list-float open" : "nav-list-float"}>
                <li>
                    <Link to={'/'} className="nav-link-float">Home</Link>
                </li>
                <li>
                    <Link to={'/allplaces'} className="nav-link-float">Tours</Link>
                </li>
                <li>
                    <Link to={'/tourguides'} className="nav-link-float">Tour Guides</Link>
                </li>
                <li>
                    <Link to={'/aboutus'} className="nav-link-float">About Us</Link>
                </li>
                {window.localStorage.getItem('isLoggedIn') === 'true' ? (
                    <Link to={"/"} className="nav-link-float" onClick={handleLogout}>Log Out</Link>
                ) : (
                    <li>
                        <Link to={'/signin'} className="nav-link-float">Log In</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default BottomNavbar;
