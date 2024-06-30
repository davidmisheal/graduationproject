import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "@fortawesome/fontawesome-free/css/all.css";
import { useTour } from "../context/TourContext";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

export default function SignLogin() {
  const [showUserIn, setShowUserIn] = useState(true);
  const [showUserUp, setShowUserUp] = useState(true);
  const [showTourGuideIn, setShowTourGuideIn] = useState(false);
  const [showTourGuideUp, setShowTourGuideUp] = useState(false);
  const [userState, setUserState] = useState("user");
  const [signUpState, setSignUpState] = useState(false);
  const [passwordState, setPasswordState] = useState(false);
  const [resetMailState, setResetMailState] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
    role: "user",
    price: "",
    location: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
    role: "",
    price: "",
    location: "",
    formError: "",
  });

  const navigate = useNavigate();
  const { setUser } = useUser();
  const { setTour } = useTour();

  const displayError = (error) => {
    return error ? <p style={{ color: "red" }}>{error}</p> : null;
  };

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    const handleSignUpClick = () =>
      container.classList.add("right-panel-active");
    const handleSignInClick = () =>
      container.classList.remove("right-panel-active");

    if (signInButton && signUpButton && container) {
      signUpButton.addEventListener("click", handleSignUpClick);
      signInButton.addEventListener("click", handleSignInClick);
    }

    return () => {
      if (signInButton && signUpButton) {
        signUpButton.removeEventListener("click", handleSignUpClick);
        signInButton.removeEventListener("click", handleSignInClick);
      }
    };
  }, []);

  const handleOptionsSignIn = (option) => {
    if (option === "user") {
      setShowUserIn(true);
      setShowTourGuideIn(false);
      setUserState("user");
    } else if (option === "tourguide") {
      setShowUserIn(false);
      setShowTourGuideIn(true);
      setUserState("tourguide");
    }
  };

  const handleOptionsSignUp = (option) => {
    if (option === "user") {
      setShowUserUp(true);
      setShowTourGuideUp(false);
      setFormData({ ...formData, role: "user" });
      setUserState("user");
    } else if (option === "tourguide") {
      setShowUserUp(false);
      setShowTourGuideUp(true);
      setFormData({ ...formData, role: "tourguide" });
      setUserState("tourguide");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Full Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      setErrors(newErrors);
      return; // Stop further validation
    }

    // Validate Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (newErrors.email) {
      setErrors(newErrors);
      return; // Stop further validation if email is invalid
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (newErrors.password) {
      setErrors(newErrors);
      return; // Stop further validation if password is invalid
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      setErrors(newErrors);
      return; // Stop further validation
    }

    // No errors, proceed with sign-up
    setErrors({}); // Clear any existing errors
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/signup",
        formData
      );
      setUser(response.data);
      alert("Sign-up successful!");
      navigate("/signin");
    } catch (error) {
      console.error("Sign-up failed!", error);
      setErrors({
        formError: error.response?.data?.message || "An unknown error occurred",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErrors((prev) => ({ ...prev, imageCover: "Photo is required" }));
    } else {
      setErrors((prev) => ({ ...prev, imageCover: "" })); // Clear any previous error if file is now selected
      setFormData((prev) => ({ ...prev, imageCover: file }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userState === "user") {
      const { email, password } = formData;
      const newErrors = { email: "", password: "" };

      if (!password) {
        newErrors.password = "Password is required";
        setErrors(newErrors);
        return;
      }
      setErrors({});
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/users/login",
          {
            email,
            password,
          }
        );
        setUser(response.data); // Store user data in context
        console.log("Login successful!", response.data);
        window.localStorage.setItem("isLoggedIn", true);
        window.localStorage.setItem("userData", JSON.stringify(response.data));
        navigate("/");
      } catch (error) {
        console.error("Login failed!", error);
        // Determine the error message based on status code or response
        let message = "An error occurred"; // Default error message
        if (error.response) {
          if (error.response.status === 401) {
            // Unauthorized
            message = "Incorrect email or password";
          } else {
            message = error.response.data.message || message;
          }
        }
        setErrors((prev) => ({
          ...prev,
          formError: message,
        }));
      }
    }
  };

  return (
    <>
      <Nav />
      <div className="signin-main">
        <span className="signin-options">
          <i
            className={`fa-solid fa-user-tie fa-xl icon ${
              userState === "tourguide" ? "active" : ""
            }`}
            onClick={() => {
              handleOptionsSignIn("tourguide");
            }}
          ></i>
          <i
            className={`fa-solid fa-user fa-xl icon ${
              userState === "user" ? "active" : ""
            }`}
            onClick={() => {
              handleOptionsSignIn("user");
            }}
          ></i>
        </span>
        <div className="signin-body">
          {showUserIn ? (
            <form onSubmit={handleLogin}>
              <h3>Sign in as a User!</h3>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <div style={{ color: "red" }}>{errors.email}</div>
              )}
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <div style={{ color: "red" }}>{errors.password}</div>
              )}
              <button type="submit">Sign In</button>
              {errors.formError && (
                <div style={{ color: "red" }}>{errors.formError}</div>
              )}
              <span className="signin-other">
                <Link
                  onClick={() => {
                    setPasswordState(!passwordState);
                  }}
                >
                  Forgot your password?
                </Link>
                <Link
                  onClick={() => {
                    setSignUpState(!signUpState);
                  }}
                >
                  Sign Up First!
                </Link>
              </span>
            </form>
          ) : null}
          {showTourGuideIn ? (
            <form onSubmit={handleLogin}>
              <h3>Sign in as a Tour Guide!</h3>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {displayError(errors.email)}
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <p style={{ color: "red", fontWeight: "bold", fontSize: 12 }}>
                  {errors.password}
                </p>
              )}
              <button type="submit">Sign In</button>
              <span className="signin-other">
                <a href="#">Forgot your password?</a>
                <Link
                  onClick={() => {
                    setSignUpState(!signUpState);
                  }}
                >
                  Sign Up First!
                </Link>
              </span>
            </form>
          ) : null}
        </div>
        {signUpState ? (
          <>
            <div className="signup-popup show">
              <span className="signup-exit">
                <i
                  className={`fa-solid fa-x`}
                  onClick={() => {
                    setSignUpState(false);
                  }}
                ></i>
              </span>
              <span className="signup-options">
                <i
                  className={`fa-solid fa-user-tie fa-xl icon ${
                    userState === "tourguide" ? "active" : ""
                  }`}
                  onClick={() => {
                    handleOptionsSignUp("tourguide");
                  }}
                ></i>
                <i
                  className={`fa-solid fa-user fa-xl icon ${
                    userState === "user" ? "active" : ""
                  }`}
                  onClick={() => {
                    handleOptionsSignUp("user");
                  }}
                ></i>
              </span>
              <div className="signup-body">
                {showUserUp ? (
                  <form onSubmit={handleSignUp}>
                    <h3>Sign up as a User!</h3>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    {errors.name && (
                      <div style={{ color: "red" }}>{errors.name}</div>
                    )}
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <div style={{ color: "red" }}>{errors.email}</div>
                    )}
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    {displayError(errors.password)}
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    {errors.confirmPassword && (
                      <p
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      >
                        {errors.confirmPassword}
                      </p>
                    )}

                    <button type="submit">Sign Up</button>
                  </form>
                ) : null}
                {showTourGuideUp ? (
                  <form onSubmit={handleSignUp}>
                    <h3>Sign up as a Tour Guide!</h3>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    {errors.name && (
                      <div style={{ color: "red" }}>{errors.name}</div>
                    )}{" "}
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {displayError(errors.email)}
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    {displayError(errors.password)}
                    <input
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                    {displayError(errors.price)}
                    <input
                      type="text"
                      placeholder="Location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                    {displayError(errors.location)}
                    <input
                      type="file"
                      name="imageCover"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px",
                        margin: "10px 0",
                      }}
                    />
                    {errors.imageCover && (
                      <div style={{ color: "red" }}>{errors.imageCover}</div>
                    )}
                    <button type="submit">Sign Up</button>
                  </form>
                ) : null}
              </div>
            </div>
            <div className="signup-overlay"></div>
          </>
        ) : passwordState ? (
          <ForgotPassword
            setPasswordState={setPasswordState}
            setFormData={setFormData}
            formData={formData}
            setResetMailState={setResetMailState}
          />
        ) : resetMailState ? (
          <ResetPassword
            email={formData.email}
            setResetMailState={setResetMailState}
          />
        ) : null}
        <Footer name="footer-signin" />
      </div>
    </>
  );
}
