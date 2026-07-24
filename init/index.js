require("dotenv").config();
const mongoose = require("mongoose");
require("dotenv").config();

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.MONGO_URI;

main()
  .then(() => {
    console.log("Connected to Atlas");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "689d7b6b0f8d4f51e5f9ab12",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();