const message = require("../schemas/message.model");

// controller to get all messages in a room
exports.getMessages = async (req, res) => {
  try {
    const roomId = req.params.room;
    const messages = await message.find({ room: roomId }).sort({ when: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// controller to create a new message
exports.createMessage = async (req, res) => {
  try {
    const { user, body, room, userId } = req.body;
    //basic validation
    if (!user || !body || !room || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newMessage = new message({
      user,
      body,
      room,
      userId,
    });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// controller to update a message
exports.updateMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { body } = req.body;
    const updatedMessage = await message.findByIdAndUpdate(messageId, { body }, {
      new: true,
    });
    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// controller to delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const deletedMessage = await message.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({error: "Message not found"});
        }
        res.status(200).json(deletedMessage);
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}