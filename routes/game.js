import { Router } from "express";
import { nanoid } from "nanoid";
import lowDb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";

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

export default {router, db};
