const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://devmania:${password}@cluster0.2spfb.mongodb.net/phonebook?retryWrites=true&w=majority`

const connect = () => mongoose.connect(url)
connect()
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({})
    .then((res) => {
      console.log('phonebook:')
      res.forEach((p) => console.log(p.name, p.number))
      mongoose.connection.close()
    })
    .catch((error) => console.log(error))
}

if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  connect()
    .then(() => {
      person
        .save()
        .then((res) => {
          console.log(`added ${res.name} ${res.number} to phonebook`)
          mongoose.connection.close()
        })
        .catch((error) => console.log(error.message))
    })
    .catch((error) => console.log(error.message))
}
