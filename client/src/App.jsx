import React from "react";
import Auth from "./components/Auth.jsx";
import Rooms from "./components/Rooms.jsx";
import Room from "./components/Room.jsx";
import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  const handleAuthentication = async (formData, isLogin) => {
    // Make API call to backend
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${isLogin ? "login" : "signup"}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Authentication failed");
      } else {
        setUser(data.user); // store user in state
        setToken(data.token); // store token in state
        localStorage.setItem("token", data.token); // store token in localStorage
        localStorage.setItem("user", JSON.stringify(data.user)); // store user data in localStorage
        setError(null); // clear any previous errors
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setError("An error occurred. Please try again.");
    }
  };
  //fetch all rooms as long as user is authorized
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rooms/all", {
          headers: {
            Authorization: `${token}`, //require token
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch Rooms");
        }
        console.log("Fetched rooms data:", data);

        setRooms(Array.isArray(data) ? data : data.rooms || []);
        console.log("Rooms state in App.jsx:", rooms); 
      } catch (error) {
        console.error("Error fetching rooms: ", error.message);
        setError(error.message);
      }
    };
    if (token) {
      fetchRooms();
    }
  }, [token]);

  //handle joining a room
  const handleJoinRoom = async (roomId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/rooms/${roomId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to join room.");
      }
      setActiveRoom(roomId);
      console.log(`Joined room: ${roomId}`);
    } catch (error) {
      console.error("Join room error: ", error.message);
      setError(error.message);
    }
  };
  // Find the current room if activeRoom is set
  const currentRoom = activeRoom ? rooms.find(room => room._id === activeRoom) : null;

  return (
    <>
      {token ? (
        // Logged in view
        <div className="app-container">
          <div className="app-header">
            <div className="welcome-section">
              <h2 className="welcome-text">Welcome, {user.firstName}!</h2>
              {activeRoom && (
                <button 
                  onClick={() => setActiveRoom(null)}
                  className="back-button"
                >
                  ← Back to Rooms
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setUser(null);
                setToken(null);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setRooms([]);
                setActiveRoom(null);
              }}
              className="logout-button"
            >
              Logout
            </button>
          </div>
          <div className="main-content">
            {activeRoom ? (
              <Room roomId={activeRoom} roomName={currentRoom?.name} />
            ) : ( 
              <Rooms rooms={rooms} onJoinRoom={handleJoinRoom} />
            )}
          </div>
        </div>
      ) : (
        // not logged in view
        <Auth onAuth={handleAuthentication} error={error} />
      )}
    </>
  );
}
