import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Historical from "./pages/Historical";
import Adventure from "./pages/Adventure";
import Cultural from "./pages/Cultural";
import Religious from "./pages/Religious";
import Nautical from "./pages/Nautical";
import Medical from "./pages/Medical";
import All from "./pages/AllPlaces";
import SignLogin from "./pages/SignLogin";
import AboutUs from "./pages/AboutUs";
import TourGuides from "./pages/TourGuides";
import Profile from "./pages/Profile";
import { UserProvider } from "./context/UserContext";
import MyTrips from "./pages/MyTrips";
import Requests from "./pages/Requests";
import ViewMore from "./pages/ViewMorePlace";
import { TourProvider } from "./context/TourContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const loggedIn = window.localStorage.getItem("isLoggedIn");
  const userData = window.localStorage.getItem("userData");
  console.log(loggedIn, "login");

  return (
    <ErrorBoundary>
      <Router>
        <TourProvider>
          <UserProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/historical" element={<Historical />} />
              <Route path="/adventure" element={<Adventure />} />
              <Route path="/cultural" element={<Cultural />} />
              <Route path="/religious" element={<Religious />} />
              <Route path="/nautical" element={<Nautical />} />
              <Route path="/medical" element={<Medical />} />
              <Route path="/allplaces" element={<All />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/tourguides" element={<TourGuides />} />
              <Route path="/signin" element={<SignLogin />} />
              <Route path="/mytrips" element={<MyTrips />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/viewmore/:id" element={<ViewMore />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Routes>
          </UserProvider>
        </TourProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
