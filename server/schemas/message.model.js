// bringing in mongoose models and schemas
const { Schema, model } = require("mongoose");

// defining the message schema
const messageSchema = new Schema({
  when: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: true,
  },
  room: String,
  body: String,
});

// exporting the message model
module.exports = model("Message", messageSchema);
