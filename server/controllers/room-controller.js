//Controller for handling room-related operations
const room = require("../schemas/room.model");
// controller to get all rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await room.find({});
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

// controller to create a new room
exports.createRoom = async (req, res) => {
  try {
    const { name, description, addedUsers, createdBy } = req.body;
    //basic validation
    if (!name || !description || !addedUsers || !createdBy) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newRoom = new room({
      name,
      description,
      addedUsers,
      createdBy
    });
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ message: "Error creating room" });
    console.error(error);
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const updatedRoom = await room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedRoom)
      return res.status(404).json({ message: "Room not found." });
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await room.findByIdAndDelete(req.params.id);
    if (!deletedRoom)
      return res.status(404).json({ message: "Room not found." });
    res.json({ message: "Room deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to join a room
exports.joinRoom = async (req, res) => {
  try {
    const { id } = req.params; // room ID from URL
    const { userId } = req.body; // user ID from request body
    
    // Find the room
    const roomToJoin = await room.findById(id);
    if (!roomToJoin) {
      return res.status(404).json({ message: "Room not found." });
    }
    
    // Check if user is already in the room
    if (roomToJoin.addedUsers.includes(userId)) {
      return res.status(200).json({ 
        message: "User already in room", 
        room: roomToJoin 
      });
    }
    
    // Add user to the room
    roomToJoin.addedUsers.push(userId);
    const updatedRoom = await roomToJoin.save();
    
    res.status(200).json({ 
      message: "Successfully joined room", 
      room: updatedRoom 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
