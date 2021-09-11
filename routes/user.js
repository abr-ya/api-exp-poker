const { Router } = require("express");
const { nanoid } = require("nanoid");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const router = Router();
const db = lowDb(new FileSync('data/user.json'));

router.get('/', (req, res) => {
  const data = db.get("user").value()
  return res.status(200).json(data)
});

router.get('/:game', (req, res) => {
  const data = db.get("user").value();
  return res.status(200).json(data.filter(el => el.game == req.params.game))
});

router.post('/', (req, res) => {
  const newUser = { id: nanoid(6), ...req.body }
  db.get("user").push(newUser).write();
  res.status(201).json({ newUser });
});

module.exports = {router, db};
