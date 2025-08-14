import React, { useState, useEffect } from "react";
import "./Rooms.css";

const Rooms = ({ rooms, onJoinRoom }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="rooms-container">
        <div className="rooms-card">
          <p>No rooms available at this time, please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      <div className="rooms-card">
        <h2>Available Rooms:</h2>
      <ul className="rooms-list">
        {rooms.map((room) => (
          <li
            key={room._id}
            className="room-item"
            onClick={() => onJoinRoom(room._id)}
          >
            <span className="room-name">{room.name}</span>
            <span className="room-users"> Members: {room.memberCount}</span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default Rooms;
