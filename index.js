const express = require("express");
require("dotenv").config();
const persons = require("./persons.json");
const Person = require("./models/person");
const morgan = require("morgan");

const app = express();
let data = [...persons];

const getRandomId = () => Math.floor(Math.random() * 1000);

app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("build"));

//======== GET ======
app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((persons) => {
      res.status(200).json(persons);
    })
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = data.find((p) => p.id === id);
  if (person) {
    return res.status(200).json(person);
  } else {
    return res.status(404).json({ error: `info with id ${id} not found` });
  }
});

app.get("/api/info", (req, res) => {
  res
    .status(200)
    .send(`Phone has info for ${data.length} people <br/> ${new Date(Date())}`);
});

//======== POST ======
app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  const existingRecord = data.find((p) => p.name === name);

  if (!number) {
    return res.status(400).json({ error: "number is missing" });
  }

  if (existingRecord) {
    return res.status(404).json({ error: "name must be unique" });
  }

  const person = new Person({ name, number });

  person
    .save()
    .then((savePerson) => {
      res.status(200).json(savePerson);
    })
    .catch((error) => res.status(400).json({ error: error.message }));
});

//======== DELETE ======
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  data = data.filter((p) => p.id !== id);

  return res.status(204).end();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
