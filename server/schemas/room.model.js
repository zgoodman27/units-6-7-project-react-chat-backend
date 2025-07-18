// using modules from mongoose
const { Schema, model } = require("mongoose");

const roomSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  addedUsers: {
    type: Array,
    required: true,
    unique: true,
  },
});

// create the user model using this schema
module.exports = model("Room", roomSchema);
