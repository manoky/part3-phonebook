const mongoose = require("mongoose")
require("dotenv").config()

const url = process.env.MONGO_URI

const connectToDB = () =>
  new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        console.log("connected to MongoDB")
        resolve()
      })
      .catch((error) => {
        reject("error connecting to MongoDB:", error.message)
      })
  })

module.exports = connectToDB
