const express = require("express");
require("dotenv").config();
const persons = require("./persons.json");
const Person = require("./models/person");
const morgan = require("morgan");

const app = express();
let data = [...persons];

const errorHandler = (error, request, response, next) => {
  // console.log("error", error);
  console.log("error", error.name);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ObjectParameterError") {
    return response.status(400).send({ error: "malformatted name" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const getRandomId = () => Math.floor(Math.random() * 1000);

app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("build"));

//======== GET ======
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.status(200).json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  Person.findById(id)
    .then((person) => {
      if (person) {
        return res.status(200).json(person);
      } else {
        return res.status(404).json({ error: `info with id ${id} not found` });
      }
    })
    .catch((error) => next(err));
});

app.get("/api/info", (req, res, next) => {
  Person.find({})
    .count()
    .then((number) => {
      res
        .status(200)
        .send(`Phone has info for ${number} people <br/> ${new Date(Date())}`);
    })
    .catch((error) => next(error));
});

//======== POST ======
app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).json({ error: "name is missing" });
  }

  if (!number) {
    return res.status(400).json({ error: "number is missing" });
  }

  Person.findOne({ name: name.trim() })
    .then((person) => {
      if (person) {
        return res.status(404).json({ error: "name must be unique" });
      } else {
        const person = new Person({ name, number });

        person
          .save()
          .then((savePerson) => {
            res.status(200).json(savePerson);
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

//======== PUT ======
app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).json({ error: "name is missing" });
  }

  if (!number) {
    return res.status(400).json({ error: "number is missing" });
  }

  Person.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true, context: "query" }
  )
    .exec()
    .then((person) => {
      if (person) {
        return res.status(200).json(person);
      }
    })
    .catch((error) => next(error));
});

//======== DELETE ======
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove({ _id: req.params.id })
    .then(() => {
      return res.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
