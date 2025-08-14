import React from "react";
import { useState, useEffect } from "react";
import "./Room.css";
export default function Room({ roomId, roomName }) {
  // State to hold room details and messages
  const [messages, setMessages] = useState([]); // Array to hold messages
  const [newMessage, setNewMessage] = useState(""); // State for new message input
  const [loading, setLoading] = useState(false); // Loading state for fetching messages
  const [error, setError] = useState(null); // Error state for handling errors
  const [editingMessageId, setEditingMessageId] = useState(null); // State to hold the ID of the edited message
  const [editedMessageBody, setEditedMessageBody] = useState(""); // State for edited message body

  // Get current user details from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser._id;
  const isAdmin = currentUser.role === "admin"; // Check if the user is an admin

  // Function to fetch messages for the room
  const fetchMessages = async () => {
    setLoading(true); // Set loading to true while fetching messages
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token from localStorage
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data); // Set fetched messages to state
      console.log("Fetched messages:", data); // Log fetched messages
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false after fetching messages
    }
  };
  // Function to handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent sending empty messages
    try {
      const userName =
        currentUser.firstName && currentUser.lastName
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : currentUser.email || "Anonymous";

      const response = await fetch(`http://localhost:5000/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token from localStorage
        },
        body: JSON.stringify({
          body: newMessage,
          room: roomId,
          user: userName,
          userId: currentUserId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }
      setMessages((prevMessages) => [...prevMessages, data]); // Append new message to messages
      setNewMessage(""); // Clear input field
      fetchMessages(); // Refresh messages after sending
      console.log("Message sent:", data); // Log sent message
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message);
    }
  };

  // Function to handle editing a message
  const handleEditMessage = async (messageId) => {
    if (!editedMessageBody.trim()) return; // Prevent sending empty messages
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ body: editedMessageBody }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit message");
      }
      await fetchMessages(); // Refetch messages to ensure UI is up-to-date
      setEditingMessageId(null); // Clear editing state
      setEditedMessageBody(""); // Clear edited message body
    } catch (error) {
      console.error("Error editing message:", error);
      setError(error.message);
    }
  };

  // Function to handle deleting a message
  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete message");
      }
      await fetchMessages(); // Refetch messages to ensure UI is up-to-date
    } catch (error) {
      console.error("Error deleting message:", error);
      setError(error.message);
    }
  };

  // Add a useEffect to fetch messages when roomId changes
  useEffect(() => {
    if (roomId) {
      fetchMessages();
    }
  }, [roomId]); // Run when roomId changes

  return (
    <div className="room-container">
      <div className="room-card">
        <div className="room-header">
          <h2 className="room-title">{roomName}</h2>
        </div>
        <div className="messages-container">
          {loading ? (
            <p className="loading-text">Loading messages...</p>
          ) : error ? (
            <p className="error-text">Error: {error}</p>
          ) : (
            <ul className="messages-list">
              {messages.map((message) => (
                <li key={message._id} className="message-item">
                  {editingMessageId === message._id ? (
                    <div className="message-edit-form">
                      <input
                        type="text"
                        value={editedMessageBody}
                        onChange={(e) => setEditedMessageBody(e.target.value)}
                        className="edit-input"
                      />
                      <button onClick={() => handleEditMessage(message._id)}>
                        Save
                      </button>
                      <button onClick={() => setEditingMessageId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <strong>{message.user}:</strong> {message.body}
                      {(currentUserId === message.userId || isAdmin) && (
                        <div className="message-actions">
                          <button
                            onClick={() => {
                              setEditingMessageId(message._id);
                              setEditedMessageBody(message.body);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="message-input-section">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="message-input"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
