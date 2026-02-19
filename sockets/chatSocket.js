import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const chatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        // authenticate user via JWT
        const { token } = socket.handshake.auth;
        if (!token) {
        console.log('No token provided, disconnecting');
        return socket.disconnect(true);
        }

        try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // attach user info to socket
        socket.user = {
            id: decoded.id,
            nickname: decoded.nickname,
            isAdmin: decoded.isAdmin || false,
        };
        } catch (err) {
        console.log('Invalid token, disconnecting');
        return socket.disconnect(true);
        }

        //------------- join a room -------------//
        socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.user.nickname} joined room ${roomId}`);
        });

        //--------------- handle incoming messages ---------------//
        socket.on('chatMessage', async ({ roomId, content }) => {
        if (!content || !roomId) return;

        try {
            const { id: userId, nickname } = socket.user;

            // ------------- save message to postgreSQL ------------- //
            const result = await pool.query(
            'INSERT INTO messages (room_id, sender_id, nickname, content) VALUES ($1, $2, $3, $4) RETURNING *',
            [roomId, userId, nickname, content]
            );

            const savedMessage = result.rows[0];

            // ----------------------- emit message to everyone in the room ----------------------- //
            io.to(roomId).emit('message', {
            userId: savedMessage.sender_id,
            nickname: savedMessage.nickname,
            content: savedMessage.content,
            createdAt: savedMessage.created_at,
            });
        } catch (err) {
            console.error('Error saving message:', err);
        }
        });

        // --------- handle disconnect --------- //
        socket.on('disconnect', () => {
        console.log(`${socket.user.nickname} disconnected`);
        });
    });
};

export default chatSocket;
