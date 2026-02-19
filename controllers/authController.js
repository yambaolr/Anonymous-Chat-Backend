import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// generate a temporary token with uuidv4, nickname, and isAdmin
export const getTempToken = (req, res) => {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
        return res.status(400).json({ error: 'Nickname and password are required' });
    }

    let isAdmin = false;

    if (password === process.env.ADMIN_ACCESS_PASSWORD) {
        isAdmin = true;
    } else if (password === process.env.USER_ACCESS_PASSWORD) {
        isAdmin = false;
    } else {
        return res.status(401).json({ error: 'Invalid access password' });
    }

    const token = jwt.sign(
        {
        id: uuidv4(),
        nickname,
        isAdmin
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        nickname,
        isAdmin
    });
};
