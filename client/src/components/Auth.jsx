import React from 'react'
import { useState } from 'react'

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
    <div>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit= {handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <button onClick={toggleMode}>
        Switch to {isLogin ? 'Sign Up' : 'Login'}
      </button>
    </div>
  )
}
