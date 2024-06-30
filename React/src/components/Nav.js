import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scroll } from "../func/Scroll";
import '@fortawesome/fontawesome-free/css/all.css';
import { useUser } from "../context/UserContext";
import { useTour } from "../context/TourContext";

export default function Nav(props) {
  const navigate=useNavigate()
  const { user, userLogout } = useUser();
  const { Tour, tourLogout } = useTour();
  const isScrolled = Scroll(250);
  const [profileBox, setProfileBox] = useState(false);
  const [menuBox, setMenuBox] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const userData = JSON.parse(window.localStorage.getItem('userData'));
    if (userData && userData.data) {
      if (userData.data.user) {
        setRole(userData.data.user.role);
      }
      else if( userData.data.tour){
        setRole(userData.data.tour.role);
      }
    }
  }, []);

  const toggleProfileBox = () => {
    setProfileBox(!profileBox);
    if (!profileBox) setMenuBox(false);
  };

  const toggleMenuBox = () => {
    setMenuBox(!menuBox);
    if (!menuBox) setProfileBox(false);
  };

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
    navigate("/")
    window.location.reload();
  };

  return (
    <nav className='main-nav-body'>
      <div className="logo-search">
        <i className="fa-solid fa-bars" onClick={toggleMenuBox}></i>
        <span>
          <Link to={'/'} className="website-title">
            <h2>MeetThePharaohs</h2>
          </Link>
        </span>
        <i className="fa-regular fa-user" onClick={toggleProfileBox}></i>
      </div>
      <div>
        <ul className="nav-list">
          <li>
            <Link to={'/'} className="nav-link">Home</Link>
          </li>
          <li className="dropdown">
            <Link className="nav-link" to={'/allplaces'}>Tours</Link>
            <div className="dropdown-content">
              <Link className="nav-link" to={'/historical'}>Historical</Link>
              <Link className="nav-link" to={'/adventure'}>Adventure</Link>
              <Link className="nav-link" to={'/cultural'}>Cultural</Link>
              <Link className="nav-link" to={'/religious'}>Religious</Link>
              <Link className="nav-link" to={'/nautical'}>Nautical</Link>
              <Link className="nav-link" to={'/medical'}>Medical</Link>
            </div>
          </li>
          <li>
            <Link to={'/tourguides'} className="nav-link">Tour Guides</Link>
          </li>
          <li>
            <Link to={'/aboutus'} className="nav-link">About Us</Link>
          </li>
          <li>
            {role === 'admin' && <Link className="nav-link" to={'/requests'}>Requests</Link>}
            {role === 'user' && <Link className="nav-link" to={'/mytrips'}>My Trips</Link>}
            {role === 'tourguide' && <Link className="nav-link" to={'/myorders'}>My Orders</Link>}
          </li>
          <li className="user-things">
            <i className="fa-regular fa-user fa-lg" onClick={toggleProfileBox}></i>
          </li>
        </ul>
      </div>
      {(profileBox || menuBox) && <div className="overlay-navbar"></div>}
      {profileBox && (
        <div className="profile-box">
          <Link to={'/profile'} ><i className="fa-solid fa-user fa-2xl"></i></Link>
          {window.localStorage.getItem('isLoggedIn') === 'true' ? (
            <Link to={'/'} className="profile-box-link" onClick={handleLogout}>Log Out</Link>
          ) : (
            <Link to={'/signin'} className="profile-box-link">Sign In</Link>
          )}
        </div>
      )}
      {menuBox && (
        <div className="menuBox">
          <ul>
            <li>
              <Link to={'/'} className="menunavlink">Home</Link>
            </li>
            <li>
              <Link to={'/allplaces'} className="menunavlink">Tours</Link>
            </li>
            <li>
              <Link to={'/tourguides'} className="menunavlink">Tour Guides</Link>
            </li>
            <li>
              <Link to={'/aboutus'} className="menunavlink">About Us</Link>
            </li>
            <li>
              <Link to={'/blog'} className="menunavlink">Blog</Link>
            </li>
            <li>
              <Link to={'/sign'} className="menunavlink">Log In</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
