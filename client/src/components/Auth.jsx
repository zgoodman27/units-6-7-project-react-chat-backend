import React from 'react'
import { useState } from 'react'
import './Auth.css'

export default function Auth({ onAuth }) {
    const [isLogin, setIsLogin] = useState(false) // true = login, false = signup
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    }) 

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const toggleMode = () => {
        setIsLogin(!isLogin)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onAuth(formData, isLogin) // Call the function from App.jsx
    }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </>
          )}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div className="toggle-section">
          <button onClick={toggleMode} className="toggle-button">
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
