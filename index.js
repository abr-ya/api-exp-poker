const express = require("express");
const cors = require("cors");
const user = require("./routes/user.js");
const game = require("./routes/game.js");
const task = require("./routes/task.js");

const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();

// сервер, паблик, сокеты
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname, 'public'))); // set static

// настройки для REST
app.use(cors());
app.use(express.json())
app.use('/user', user.router);
app.use('/game', game.router);
app.use('/task', task.router);

// temp - на корень - все пользователи
app.get('/', (req, res) => {
  const data = user.db.get("user").value()
  return res.json(data)
});

const allUsers = user.db.get("user").value();
const allTasks = task.db.get("task").value();
// console.log(users);

// Run when client connects
const botName = 'Socket Test App Bot';
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    const users = allUsers.filter(el => el.game === room);
    const tasks = allTasks.filter(el => el.game === room);
    socket.emit('data', {
      users,
      tasks,
      cards: [1, 3, 5, 7, 9, 'coffee'],
    });
    socket.emit('message', formatMessage(botName, 'Welcome to Socket Test App Bot!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, ()=> {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
