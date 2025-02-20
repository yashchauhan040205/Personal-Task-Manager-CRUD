
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { validateTask } = require("./middleware");

const app = express();
const PORT = 3000;
const DATA_FILE = "tasks.json";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const loadTasks = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
};
const saveTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

app.get("/tasks", (req, res) => {
  res.json(loadTasks());
});

app.post("/tasks", validateTask, (req, res) => {
  const tasks = loadTasks();
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", validateTask, (req, res) => {
  let tasks = loadTasks();
  const taskIndex = tasks.findIndex((t) => t.id == req.params.id);
  if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });
  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  saveTasks(tasks);
  res.json(tasks[taskIndex]);
});

app.delete("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  tasks = tasks.filter((t) => t.id != req.params.id);
  saveTasks(tasks);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
