const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('node:path');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const players = {};

app.use(express.static(path.join(__dirname, '..', 'client')));


io.on('connection', (socket) => {
  console.log(`[Connected] Player joined with ID: ${socket.id}`);

  players[socket.id] = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id
  };

  // Send existing players to the newly connected player
  socket.emit('currentPlayers', players);

  // Broadcast the new player to all other connected clients
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // Handle incoming movement coordinates from this player
  socket.on('playerMovement', (movementData) => {
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      // Send updated position to all other players
      socket.broadcast.emit('playerMoved', players[socket.id]);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Disconnected] Player left: ${socket.id}`);
    delete players[socket.id];
    io.emit('removePlayer', socket.id);
  });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});
