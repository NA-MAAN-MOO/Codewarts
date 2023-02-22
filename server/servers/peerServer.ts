import { Peer } from 'peerjs';

export const makePeer = (id: string) => {
  const peer = new Peer(id);
  peer.on('connection', (conn) => {
    conn.on('data', (data) => {
      // Will print 'hi!'
      console.log(data);
    });
    conn.on('open', () => {
      conn.send('hello!');
    });
  });
};

export const connectPeer = (peer, id) => {
  const conn = peer.connect(id);
  conn.on('open', () => {
    conn.send('hi');
  });
};

export default peerServer;
