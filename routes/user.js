import { Router } from "express";
import { nanoid } from "nanoid";
import lowDb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";

const router = Router();
const db = lowDb(new FileSync('data/user.json'));

router.get('/', (req, res) => {
  const data = db.get("user").value()
  return res.json(data)
});

router.get('/:game', (req, res) => {
  const data = db.get("user").value();
  return res.json(data.filter(el => el.game == req.params.game))
});

router.post('/new', (req, res) => {
  db.get("user").push({ id: nanoid(6), ...req.body }).write();
  res.json({ success: true });
});

export default {router, db};
