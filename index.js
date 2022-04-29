const express = require("express");
const persons = require("./persons.json");

const app = express();
let data = [...persons];

const getRandomId = () => Math.floor(Math.random() * 1000);

app.use(express.json());

//======== GET ======
app.get("/api/persons", (req, res) => {
  res.status(200).json(data);
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
  const person = data.find((p) => p.name === name);

  if (!name) {
    return res.status(400).json({ error: "name is missing" });
  }

  if (!number) {
    return res.status(400).json({ error: "number is missing" });
  }

  if (person) {
    return res.status(404).json({ error: "name must be unique" });
  }

  const newInfo = { name, number, id: getRandomId() };
  data = data.concat(newInfo);

  res.status(200).json(newInfo);
});

//======== DELETE ======
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  data = data.filter((p) => p.id !== id);

  return res.status(204).end();
});

const PORT = 3001;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
