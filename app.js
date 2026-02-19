import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// rate limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many login attempts. Try again later.' }
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200,
    message: { error: 'Too many requests. Slow down.' }
});

// apply api rate limiter to all routes except auth
app.use('/api', apiLimiter);

// routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Anonymous Chat API</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333; margin: 0; padding: 20px; }
            h1 { color: #4a90e2; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4a90e2; color: #fff; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            p { font-size: 16px; }
            code { background-color: #eee; padding: 2px 5px; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h1>Anonymous Chat API</h1>
        <p>Test this API on Postman using the following endpoints:</p>
        <table>
            <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
                <th>Requires Auth</th>
            </tr>
            <tr>
                <td>POST</td>
                <td>/api/auth/temp-token</td>
                <td>Login anonymously with nickname & password</td>
                <td>No</td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/rooms</td>
                <td>Get list of chat rooms</td>
                <td>No</td>
            </tr>
            <tr>
                <td>POST</td>
                <td>/api/rooms</td>
                <td>Create a new room (admin only)</td>
                <td>Yes (JWT, admin)</td>
            </tr>
            <tr>
                <td>DELETE</td>
                <td>/api/rooms/:roomId</td>
                <td>Delete a room (admin only)</td>
                <td>Yes (JWT, admin)</td>
            </tr>
            <tr>
                <td>GET</td>
                <td>/api/chat/:roomId/messages</td>
                <td>Fetch messages for a room</td>
                <td>Yes (JWT)</td>
            </tr>
            <tr>
                <td>POST</td>
                <td>/api/chat/:roomId/messages</td>
                <td>Send a message in a room</td>
                <td>Yes (JWT)</td>
            </tr>
        </table>
        <p>Use Postman to test the API with JSON bodies and your JWT token for protected routes.</p>
        <p>Example of Authorization header for protected routes:</p>
        <code>Authorization: Bearer &lt;your-token&gt;</code>
    </body>
    </html>
    `);
});


export default app;
