import React from 'react'
import Auth from './components/Auth.jsx'
import { useState } from 'react'

export default function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)
  
  const handleAuthentication = async (formData, isLogin) => {
    // Make API call to backend
    try {
      const response = await fetch(`http://localhost:5000/api/users/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data= await response.json()
      if (!response.ok) {
        setError(data.error || 'Authentication failed')
      } else {
        setUser(data.user)// store user in state
        setToken(data.token)// store token in state
        localStorage.setItem('token', data.token) // store token in localStorage
        setError(null) // clear any previous errors
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setError("An error occurred. Please try again.");
    }
  }
  return (
    <>
      {token ? (
        // Logged in view
        <div>
          <h1>Welcome, {user.firstName}!</h1>
          {//Room component will go here
          }
        </div>
      ) : (
        // not logged in view
        <Auth onAuth={handleAuthentication} error={error} />
      )}
    </>
  )
}
