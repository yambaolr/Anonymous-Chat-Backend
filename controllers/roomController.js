import pool from '../config/db.js';

// load all rooms
export const getRooms = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title, created_at FROM rooms ORDER BY created_at ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// create a new room, only for admin users, room title must be unique and between 3-50 characters
export const createRoom = async (req, res) => {
    const { isAdmin } = req.user;
    if (!isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Admin only' });
    }

    const { title } = req.body;
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: 'Room title is required' });
    }

    const cleanTitle = title.trim();
    if (cleanTitle.length < 3 || cleanTitle.length > 50) {
        return res.status(400).json({
            message: 'Room title must be between 3 and 50 characters'
        });
    }

    try {
        const result = await pool.query(
            'INSERT INTO rooms (title) VALUES ($1) RETURNING id, title, created_at',
            [cleanTitle]
        );
        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(400).json({
                message: 'A room with this title already exists'
            });
        }
        return res.status(500).json({ message: 'Server error' });
    }
};

// delete room by id, only for admin users
export const deleteRoom = async (req, res) => {
    const { isAdmin } = req.user;
    if (!isAdmin) return res.status(403).json({ message: 'Forbidden: Admin only' });

    try {
        const { roomId } = req.params;

        // delete messages first due to foreign key constraint
        await pool.query('DELETE FROM messages WHERE room_id=$1', [roomId]);

        // delete room itself
        const result = await pool.query('DELETE FROM rooms WHERE id=$1 RETURNING *', [roomId]);

        if (!result.rowCount) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json({ message: 'Room deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

