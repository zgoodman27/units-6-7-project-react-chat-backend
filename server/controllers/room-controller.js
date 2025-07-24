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
// controller to get a specific room by ID
exports.getRoomById = async (req, res) => {
    try {
        const roomId = req.params.id;
        const foundRoom = await room.findById(roomId);
        if (!foundRoom) {
          return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json(foundRoom);
    } catch (error) {
        res.status(500).json({ message: "Error fetching room" });
    }
};

// controller to create a new room
exports.createRoom = async (req, res) => {
  try {
    const { name, description, addedUsers } = req.body;
    //basic validation
    if (!name || !description || !addedUsers) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newRoom = new room({
      name,
      description,
      addedUsers,
    });
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ message: "Error creating room" });
    console.error(error);
  }
};
