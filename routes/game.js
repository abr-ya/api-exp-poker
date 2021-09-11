const { Router } = require("express");
const { nanoid } = require("nanoid");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const router = Router();
const db = lowDb(new FileSync('data/game.json'));

router.get('/', (req, res) => {
  const data = db.get("game").value()
  return res.status(200).json(data)
});

router.get('/:id', (req, res) => {
  const data = db.get("game").value();
  return res.status(200).json(data.filter(el => el.id == req.params.id))
});

router.post('/', (req, res) => {
  const newGame = { id: nanoid(6), status: "new" }
  db.get("game").push(newGame).write();
  res.status(201).json({ newGame });
});

module.exports = {router, db};
