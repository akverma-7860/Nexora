const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },

  profileImage: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
});

userSchema.plugin(plm.default || plm);

module.exports = mongoose.model("User", userSchema);