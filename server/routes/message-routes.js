const express = require('express');
const Router = express.Router();
const { validateSession } = require("../middleware/validation");
const adminOnly = require("../middleware/isAdmin");
const messageController = require('../controllers/message-controller');

// Route to get all messages in a room
Router.get('/:room', messageController.getMessages);

// Route to create a new message
Router.post('/', messageController.createMessage);
 
// Route to update a message
Router.put('/update/:id', validateSession, adminOnly, messageController.updateMessage);

// Route to delete a message
Router.delete('/delete/:id', validateSession, adminOnly, messageController.deleteMessage);

module.exports = Router;