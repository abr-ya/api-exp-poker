const { Router } = require("express");
const { nanoid } = require("nanoid");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const router = Router();
const db = lowDb(new FileSync('data/task.json'));

router.get('/', (req, res) => {
  const data = db.get("task").value()
  return res.status(200).json(data)
});

router.get('/:id', (req, res) => {
  const data = db.get("task").value();
  return res.status(200).json(data.filter(el => el.id == req.params.id))
});

router.post('/', (req, res) => {
  const newTask = { id: nanoid(6), status: "new" }
  db.get("task").push(newTask).write();
  res.status(201).json({ newTask });
});

module.exports = {router, db};
