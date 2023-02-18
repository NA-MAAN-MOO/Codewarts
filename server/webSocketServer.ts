#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket1 = require('ws');
const http = require('http');
const wss = new WebSocket1.Server({ noServer: true });
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

// const host = process.env.HOST || 'localhost';
// const port = process.env.PORT || 1234;

const server = http.createServer((request: any, response: any) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('okay');
});

wss.on('connection', setupWSConnection);

server.on('upgrade', (request: any, socket: any, head: any) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth = (ws: any) => {
    wss.emit('connection', ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(1234, () => {
  console.log(`running at on port 1234`);
});
