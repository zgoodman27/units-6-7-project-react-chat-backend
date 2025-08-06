import React, { useState, useEffect } from "react";
import "./Rooms.css";

const Rooms = ({ rooms, onJoinRoom }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="rooms-container">
        <p> No rooms available at this time, please try again later. </p>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      <h2>Available Rooms: </h2>
      <ul className="rooms-list">
        {rooms.map((room) => (
          <li
            key={room.id}
            className="room-item"
            onClick={() => onJoinRoom(room.id)}
          >
            <span className="room-name">{room.name}</span>
            <span className="room-users">{room.users} Members: </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rooms;
