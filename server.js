import './config/env.js';

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import chatSocket from './sockets/chatSocket.js';
import './config/db.js';


const server = http.createServer(app);

// initialize socket.io with CORS settings
const io = new Server(server, {
    cors: { origin: '*' }
});

chatSocket(io);

server.listen(process.env.PORT, () =>
    console.log(`Server is running on port ${process.env.PORT}`),
);