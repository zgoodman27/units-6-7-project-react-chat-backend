import React from 'react'
import { useState, useEffect } from 'react'
import './Room.css'
export default function Room({ roomId, roomName }) {
  // State to hold room details and messages
  const [messages, setMessages] = useState([]) // Array to hold messages
  const [newMessage, setNewMessage] = useState('') // State for new message input
  const [loading, setLoading] = useState(false) // Loading state for fetching messages
  const [error, setError] = useState(null) // Error state for handling errors
  
  
  // Function to fetch messages for the room
  const fetchMessages = async () => {
    setLoading(true) // Set loading to true while fetching messages
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token from localStorage
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      const data = await response.json()
      setMessages(data) // Set fetched messages to state
      console.log('Fetched messages:', data) // Log fetched messages
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError(error.message)
    } finally {
      setLoading(false) // Set loading to false after fetching messages 
    }
  }
  // Function to handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return // Prevent sending empty messages
    try {
      const response = await fetch(`http://localhost:5000/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token from localStorage
        },
        body: JSON.stringify({ 
          body: newMessage, 
          room: roomId,
          user: localStorage.getItem('userId') || 'Anonymous' 
        })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }
      setMessages((prevMessages) => [...prevMessages, data]) // Append new message to messages
      setNewMessage('') // Clear input field
      fetchMessages() // Refresh messages after sending
      console.log('Message sent:', data) // Log sent message
    } catch (error) {
      console.error('Error sending message:', error)
      setError(error.message)
    }
  }
  
  
  // Add a useEffect to fetch messages when roomId changes
  useEffect(() => {
    if (roomId) {
      fetchMessages()
     
    }
  }, [roomId]) // Run when roomId changes

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
                  {message.body}
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
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
