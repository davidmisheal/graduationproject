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
  });

  const navigate = useNavigate();
  const { setUser } = useUser();
  const { setTour } = useTour();

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
    console.log("Form Data:", formData);

    if (userState === "user") {
      const { name, email, password, confirmPassword, role } = formData;
      let isValid = true;
      const newErrors = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      };

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        newErrors.email = "Invalid email address";
        isValid = false;
      }

      if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
        isValid = false;
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }

      console.log("Validation Errors:", newErrors);
      setErrors(newErrors);

      if (!isValid) {
        console.log("Validation failed");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/users/signup",
          { name, email, password, role }
        );
        setUser(response.data);
        console.log("Sign-up successful!", response.data);
        setSignUpState(false)
        navigate("/signin");
      } catch (error) {
        console.error("Sign-up failed!", error);
        if (error.response) {
          console.error("Error Response Data:", error.response.data);
          console.error("Error Response Status:", error.response.status);
          console.error("Error Response Headers:", error.response.headers);
        }
        setErrors((prev) => ({
          ...prev,
          formError: error.response
            ? error.response.data.message
            : "An unknown error occurred",
        }));
      }
    } else if (userState === "tourguide") {
      const { name, email, password, location, price, role } = formData;
      let isValid = true;
      const newErrors = {
        name: "",
        email: "",
        password: "",
        price: "",
        location: "",
      };

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        newErrors.email = "Invalid email address";
        isValid = false;
      }

      if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
        isValid = false;
      }

      console.log("Validation Errors:", newErrors);
      setErrors(newErrors);

      if (!isValid) {
        console.log("Validation failed");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/tours/signup",
          { name, email, password, location, price, role }
        );
        setTour(response.data);
        console.log("Sign-up successful!", response.data);
        alert("Wait an Admin to confirm!")
        navigate("/");
      } catch (error) {
        console.error("Sign-up failed!", error);
        if (error.response) {
          console.error("Error Response Data:", error.response.data);
          console.error("Error Response Status:", error.response.status);
          console.error("Error Response Headers:", error.response.headers);
        }
        setErrors((prev) => ({
          ...prev,
          formError: error.response
            ? error.response.data.message
            : "An unknown error occurred",
        }));
      }
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
        setErrors((prev) => ({
          ...prev,
          formError: error.response.data.message || "An error occurred",
        }));
      }
    } else if (userState === "tourguide") {
      const { email, password } = formData;
      const newErrors = { email: "", password: "" };

      if (!password) {
        newErrors.password = "Password is required";
        setErrors(newErrors);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/tours/login",
          {
            email,
            password,
          }
        );
        setTour(response.data); // Store user data in context
        console.log("Login successful!", response.data);
        window.localStorage.setItem("isLoggedIn", true);
        window.localStorage.setItem("userData", JSON.stringify(response.data));
        navigate("/");
      } catch (error) {
        console.error("Login failed!", error);
        setErrors((prev) => ({
          ...prev,
          formError: error.response.data.message || "An error occurred",
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
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
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
                    {errors.password && (
                      <p
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      >
                        {errors.password}
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
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />

                    {errors.password && (
                      <p
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      >
                        {errors.password}
                      </p>
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
