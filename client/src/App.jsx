import React from "react";
import Auth from "./components/Auth.jsx";
import Rooms from "./components/Rooms.jsx";
import { useState } from "react";
import { useEffect } from "react";

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
        const response = await fetch("http://localhost:5000/api/rooms", {
          headers: {
            Authorization: `${token}`, //require token
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch Rooms");
        }
        setRooms(data.rooms);
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
            "Content-Type": "application/jason",
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
  return (
    <>
      {token ? (
        // Logged in view
        <div>
          <h1>Welcome, {user.firstName}!</h1>
          {activeRoom ? (
            <p>"You're in room: "{activeRoom}</p>
          ) : (
            <Rooms rooms={rooms} onJoinRoom={handleJoinRoom} />
          )}
          <button
            onClick={() => {
              setUser(null);
              setToken(null);
              localStorage.removeItem("token");
              setRooms([]);
              setActiveRoom(null);
            }}
          >
            {" "}
            Logout{" "}
          </button>
        </div>
      ) : (
        // not logged in view
        <Auth onAuth={handleAuthentication} error={error} />
      )}
    </>
  );
}
