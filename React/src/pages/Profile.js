import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useUser } from "../context/UserContext"; // Import useUser hook
import ChangePassword from "../components/ChangePassword";

export default function Profile() {
  const [edit, setEdit] = useState(false);
  const { user } = useUser(); // Use the user data
  const isLoggedIn = window.localStorage.getItem('isLoggedIn');
  const userData = JSON.parse(window.localStorage.getItem('userData'));
  const [email, setEmail] = useState('');

  useEffect(() => {
    function showUser() {
      const userData = JSON.parse(window.localStorage.getItem('userData'));
      if (userData && userData.data) {
        if (userData.data.user) {
          setEmail(userData.data.user.email);
        } else if (userData.data.tour) {
          setEmail(userData.data.tour.email);
        }
      }
    }
    showUser();
  }, []);

  return (
    <>
      <Nav />
      <div className="profile-main">
        <div className="profile-part">
          <i className="fa-solid fa-user fa-2xl"></i>
          <span className="profile-email">
            <h2>E-Mail</h2>
            <p>{isLoggedIn ? email : "Loading..."}</p>
          </span>
          <span className="profile-pass">
            <span>
              <h2>Password</h2>
              <p>*************</p>
            </span>
            <i className="fa-regular fa-pen-to-square" onClick={() => setEdit(!edit)}></i>
            {edit && <ChangePassword />}
          </span>
        </div>
      </div>
      <Footer name="footer-main" />
    </>
  );
}
