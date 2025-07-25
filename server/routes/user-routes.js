//User Routes
const express = require('express');
const Router = express.Router();
const userController = require('../controllers/user-controller');
const { validateSession } = require('../middleware/validation');
// /users/signup - Register a new user
Router.post('/signup', userController.signup);

// /users/login - Login an existing user
Router.post('/login', userController.login);

// /users/update/:id - Update user details
Router.put('/update/:id', validateSession, userController.updateUser);

// /users/delete/:id - Delete a user
Router.delete('/delete/:id', validateSession, userController.deleteUser);

// Export the Router
module.exports = Router;