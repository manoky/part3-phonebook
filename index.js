const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("build"))
morgan.token("body", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :response-time :body"))

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body
  const generateId = () => Math.random() * (1000 - 1) + 1

  if (!name) {
    res.status(400).json({ error: "Missing required field: Name" })
    return
  }

  if (!number) {
    res.status(400).json({ error: "Missing required field: Number" })
    return
  }

  const existingName = persons.find((person) => person.name === name)

  if (existingName) {
    res
      .status(400)
      .json({ error: `${name} already exist; name should be unique` })

    return
  }

  const newPerson = { name, number, id: generateId() }
  persons = persons.concat(newPerson)

  res.json(newPerson)
})

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === +req.params.id)

  if (!person) {
    res.status(404).end()
    return
  }
  res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== +req.params.id)

  res.status(204).end()
})

app.get("/info", (req, res) => {
  const date = new Date()
  res.send(
    `<div>
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${date}</p> 
            </div>`,
  )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
