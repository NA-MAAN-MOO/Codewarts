const express = require('express');
const app = express();

const http2 = require('http');
const server2 = http2.createServer(app);

const socket = require('socket.io');
const io = socket(server2, {
  cors: {
    origin: '*',
  },
});

io.on('connection', onConnection);

function onConnection(socket: any) {
  socket.on('drawing', (data: any) => socket.broadcast.emit('drawing', data));
}
const port = 3004;
server2.listen(port, () => console.log(`server is running on port ${port}`));
