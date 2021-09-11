const express = require("express");
const cors = require("cors");
const user = require("./routes/user.js");
const game = require("./routes/game.js");

const app = express();

app.use(cors());
app.use(express.json())
app.use('/user', user.router);
app.use('/game', game.router);

// temp - на корень - все пользователи
app.get('/', (req, res) => {
  const data = user.db.get("user").value()
  return res.json(data)
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
