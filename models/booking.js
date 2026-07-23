const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Product Size
  size: {
    type: String,
    enum: ["S","M","L","XL","XXL"],
    required: true
  },

  // Quantity
  quantity: {
    type: Number,
    default: 1
  },

  // Customer Name
  fullName: {
    type: String,
    required: true
  },

  // Mobile Number
  phone: {
    type: String,
  required: true,
  trim: true
  },

  // Address
  address: {
    type: String,
    required: true
  },

  // City
  city: {
    type: String,
    required: true
  },

  // State
  state: {
    type: String,
    required: true
  },

  // Pincode
  pincode: {
    type: String,
    required: true
  },

  // Payment Method
 paymentMethod: {
  type: String,
  enum: [
    "Cash on Delivery",
    "UPI",
    "Credit Card",
    "Debit Card",
    "Net Banking"
  ],
  default: "Cash on Delivery"
},
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Booking", bookingSchema);