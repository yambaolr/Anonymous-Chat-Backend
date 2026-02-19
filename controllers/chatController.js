import pool from '../config/db.js';

// load messages for a specific room
export const getMessagesByRoom = async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) return res.status(400).json({ message: 'Room ID is required' });

    try {
        const result = await pool.query(
        'SELECT sender_id, nickname, content, created_at FROM messages WHERE room_id=$1 ORDER BY created_at ASC',
        [roomId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// if room exists, send message to a specific room, then save message to db
export const sendMessage = async (req, res) => {
    const { roomId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;
    const nickname = req.user.nickname;

    const roomCheck = await pool.query(
        'SELECT id FROM rooms WHERE id=$1',
        [roomId]
    );

    if (!roomCheck.rowCount) {
        return res.status(404).json({ message: 'Room not found' });
    }

    if (!content) {
        return res.status(400).json({ message: 'Message content required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO messages (room_id, sender_id, nickname, content)
            VALUES ($1, $2, $3, $4)
            RETURNING sender_id, nickname, content, created_at`,
            [roomId, senderId, nickname, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

