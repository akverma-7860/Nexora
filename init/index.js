const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.MONGO_URI;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to Atlas");
}

const initDB = async () => {
  const updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: "689d7b6b0f8d4f51e5f9ab12",
  }));

  await Listing.insertMany(updatedData);

  console.log("data was initialized");
};

main()
  .then(() => initDB())
  .then(() => {
    console.log("Done");
    mongoose.connection.close();
  })
  .catch((err) => console.log(err));