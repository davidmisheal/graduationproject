import React, { useEffect, useState, useCallback } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useUser } from "../context/UserContext";
import ChangePassword from "../components/ChangePassword";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

export default function Profile() {
  const [edit, setEdit] = useState(false);
  const { user } = useUser();
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");
  const [userData, setUserData] = useState(() => {
    const storedUserData = window.localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });
  const [email, setEmail] = useState("");
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = useCallback(async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/users/favorites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      return response.data.data.favorites;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (userData && userData.data) {
      if (userData.data.user) {
        setEmail(userData.data.user.email);
      } else if (userData.data.tour) {
        setEmail(userData.data.tour.email);
      }
      if (userData.token) {
        fetchFavorites(userData.token).then((favs) => setFavorites(favs));
      }
    }
    console.log("Email set in Profile:", email);
  }, [userData, fetchFavorites, email]);

  const handleRemoveFavorite = async (placeId) => {
    console.log("Attempting to remove favorite:", placeId);
    try {
      if (userData && userData.token) {
        const token = userData.token;
        const response = await axios.delete(
          "http://localhost:3000/api/v1/users/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              placeId: placeId,
            },
          }
        );
        console.log("Remove favorite response:", response);
        setFavorites(favorites.filter((place) => place._id !== placeId));
        console.log("Updated favorites list:", favorites);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);

    const userData = JSON.parse(window.localStorage.getItem('userData'));

    let apiUrl = "http://localhost:3000/api/v1/users/updateMe";
    let updatedData = {};

    if (userData.data.user) {
      apiUrl = "http://localhost:3000/api/v1/users/updateMe";
      updatedData = {
        ...userData,
        data: {
          ...userData.data,
          user: {
            ...userData.data.user,
            photo: null // this will be updated later
          }
        }
      };
    } else if (userData.data.tour) {
      apiUrl = `http://localhost:3000/api/v1/tours/${userData.data.tour._id}`;
      updatedData = {
        ...userData,
        data: {
          ...userData.data,
          tour: {
            ...userData.data.tour,
            imageCover: null // this will be updated later
          }
        }
      };
    }

    try {
      const response = await axios.patch(
        apiUrl,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      console.log("Photo upload response:", response);
      alert("Profile photo updated successfully!");

      if (userData.data.user) {
        updatedData.data.user.photo = response.data.data.user.photo;
      } else if (userData.data.tour) {
        updatedData.data.tour.imageCover = response.data.data.tour.imageCover;
      }

      setUserData(updatedData);

      window.localStorage.setItem("userData", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to update profile photo");
    }
  };


  if (!userData) {
    return (
      <>
        <Nav />
        <div className="profile-main">
          <p>
            You need to <Link to="/signin">sign in</Link> to view your profile.
          </p>
        </div>
        <Footer name="footer-main" />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="profile-main">
        <div className="profile-part">
          <h2 className="profile-title">My Profile</h2>
          <div className="profile-picture">
            {userData.data.user && userData.data.user.photo ? (
              <img
                src={`http://localhost:3000/img/users/${userData.data.user.photo}`}
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "http://localhost:3000/img/users/default.jpg";
                }}
              />
            ) : (
              <i className="fa-solid fa-user fa-2xl"></i>
            )}
            <label htmlFor="photo-upload" className="photo-upload-label">
              <FaCamera />
              <input
                id="photo-upload"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <span className="profile-email">
            <h2>E-Mail</h2>
            <p className="pass-email">{isLoggedIn ? email : "Loading..."}</p>
          </span>
          <span className="profile-pass">
            <h2>Password</h2>
            <p className="pass-p">..............</p>
            <p className="changepass" onClick={() => setEdit(!edit)}>
              Change Password?
            </p>
            {edit && <ChangePassword email={email} />}
          </span>
        </div>

        <div className="favorites-section">
          <h2>Favorites</h2>
          {favorites.length > 0 ? (
            <ul className="favorites-list">
              {favorites.map((place) => (
                <li key={place._id} className="favorite-item">
                  <div>
                    {place.img ? (
                      <img
                        src={require(`../imgs/${place.img}`)}
                        alt={place.name}
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        No Image Available
                      </div>
                    )}
                    <span>
                      <h4>{place.name}</h4>
                      <p>{place.location}</p>
                    </span>
                  </div>
                  <button
                    className="favourite-remove"
                    onClick={() => handleRemoveFavorite(place._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No favorite places yet.</p>
          )}
        </div>
      </div>
      <Footer name="footer-main" />
    </>
  );
}
