const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectToDB = require('./mongo')
const Person = require('./models/person')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time :body'))

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body

  if (!name) {
    res.status(400).json({ error: 'Missing required field: Name' })
    return
  }

  if (!number) {
    res.status(400).json({ error: 'Missing required field: Number' })
    return
  }

  try {
    const newPerson = Person({
      name,
      number,
    })

    await newPerson.save()

    res.json(newPerson)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)

    if (!person) {
      res.status(404).end()
      return
    }
    res.json(person)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const { name, number } = req.body
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' },
    )

    if (!person) {
      res.status(404).end()
      return
    }
    res.json(person)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.get('/info', async (req, res) => {
  const date = new Date()
  const persons = await Person.find({})
  res.send(
    `<div>
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${date}</p> 
            </div>`,
  )
})

app.use(errorHandler)

const { PORT } = process.env

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
