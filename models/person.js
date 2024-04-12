const mongoose = require("mongoose")
const personSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      minLength: 5,
    },
    number: {
      type: String,
      required: true,
      minLength: 10,
      validate: {
        validator: function (v) {
          return /^(\d{3}-\d{7}|\d{2}-\d{8})$/.test(v)
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  },
  {
    toJSON: {
      transform: (doc, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      },
    },
  },
)

module.exports = mongoose.model("Person", personSchema)
