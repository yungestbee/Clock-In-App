import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const InstructorDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");

  // Function to fetch a more specific address
  const getAddressFromCoords = async (latitude, longitude) => {
    const apiKey = "b88304e1143b4f459cf6490ff9bb021e"; // Replace with your API Key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results.length > 0) {
          const components = data.results[0].components;
          console.log(data)

        // Prioritize specific area details
        const suburb =
          components.suburb ||
          components.neighbourhood ||
          components.district ||
          components.town;
        const city = components.city || components.county;
        const state = components.state;

        // Construct detailed address
        return `${suburb ? suburb + ", " : ""}${
          city ? city + ", " : ""
        }${state}`;
      }
      return "Unknown Location";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error retrieving location";
    }
  };

  // Clock-in function
  const handleClockIn = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude, "Longitude:", longitude);

        try {
          // Step 1: Fetch Address
          const locationName = await getAddressFromCoords(latitude, longitude);
          setAddress(locationName);
          console.log("Clock-in Address:", locationName);

          // Step 2: Send Clock-In Request
          const response = await axios.post(
            "http://localhost:2300/api/v1/clock/clock-in",
            { latitude, longitude, address: locationName },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              withCredentials: true,
            }
          );

          setMessage(response.data.message);
        } catch (error) {
          setMessage(error.response?.data?.message || "Clock-in failed.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        alert("Unable to retrieve location.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3 className="sidebar-title">Instructor Menu</h3>
        <nav>
          <ul className="sidebar-menu">
            <li>
              <Link to="/clockin-history" className="menu-link">
                Clock-In History
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <h2 className="dashboard-title">Instructor Dashboard</h2>
        <button
          className="clock-in-btn"
          onClick={handleClockIn}
          disabled={loading}
        >
          {loading ? "Clocking in..." : "Clock In"}
        </button>
        {message && <p className="message">{message}</p>}
        {address && <p className="location">📍 {address}</p>}
      </main>
    </div>
  );
};

export default InstructorDashboard;
