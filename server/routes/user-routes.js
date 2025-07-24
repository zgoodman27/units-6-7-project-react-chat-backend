//User Routes
const express = require('express');
const Router = express.Router();
const userController = require('../controllers/user-controller');

Router.post('/signup', userController.signup);
Router.post('/login', userController.login);

// Export the Router
module.exports = Router;