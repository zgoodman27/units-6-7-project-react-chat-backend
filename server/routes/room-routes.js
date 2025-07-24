// import the modules
const { Router } = require("express");
const { validateSession } = require("../middleware/validation");
const { getRoom, getAllRooms, createRoom } = require("../controllers/room-controller");
const { get } = require("mongoose");

// create a new Router instance
const router = Router();

// GET - /rooms/all - fetch all rooms
router.get("/all", getAllRooms);

// POST - /rooms/create
router.post("/create", validateSession, createRoom);

// Export the router
module.exports = router;
