import jwt from 'jsonwebtoken';

// middleware to protect routes, checks for valid JWT token in Authorization header
export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach user info to req
        req.user = {
        id: decoded.id,
        nickname: decoded.nickname,
        isAdmin: decoded.isAdmin || false,
        };

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
