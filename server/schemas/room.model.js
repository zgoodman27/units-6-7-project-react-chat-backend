// using modules from mongoose
const { Schema, model, default: mongoose } = require("mongoose");

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  addedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  }],
  createdBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  }],
}, { timestamps: true });

// create the user model using this schema
module.exports = model("Room", roomSchema);
