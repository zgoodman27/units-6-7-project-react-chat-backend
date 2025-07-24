// import the modules
const { Router } = require("express");
const { validateSession } = require("../middleware/validation");
const {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/room-controller");
const { get } = require("mongoose");

// create a new Router instance
const router = Router();

// GET - /rooms/all - fetch all rooms
router.get("/all", getRooms);

// POST - /rooms/create
router.post("/create", validateSession, createRoom);

// UPDATE - /rooms/update
router.put("/update", validateSession, updateRoom);

// DELETE - /rooms/delete
router.delete("/delete", validateSession, deleteRoom);

// Export the router
module.exports = router;
