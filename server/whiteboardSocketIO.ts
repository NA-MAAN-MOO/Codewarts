const express = require('express');
const app = express();

const http2 = require('http');
const server2 = http2.createServer(app);

const socket = require('socket.io');
const io = socket(server2, {
  path: '/board/',
  cors: {
    origin: '*',
  },
});

io.on('connection', onConnection);

function onConnection(socket: any) {
  console.log('connection');

  socket.on('joinRoom', (roomKey: string) => {
    console.log('joinRoom', roomKey);
    socket.join(roomKey);
  });

  socket.on('drawing', (data: any) => {
    // console.log('drawing', data.roomKey);
    socket.to(data.roomKey).emit('drawing', data);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });
}

const port = 3004;
server2.listen(port, () => console.log(`server is running on port ${port}`));
