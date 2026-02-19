## Anonymous Chat Backend

A backend-only RESTful API for an anonymous chat app with JWT authentication. Users provide a nickname and an access password to log in anonymously. Normal users can join chat rooms and send messages, while users with the admin password can also create and delete chat rooms. All actions are secured via JWT tokens.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Socket.IO
- JWT Authentication
- express-rate-limit
- Postman

## Features

- Temporary anonymous user login with JWT
- Role-based access: normal users vs admin
- Create and delete chat rooms (admin only)
- Send and fetch messages per room
- Real-time messaging via Socket.IO
- Rate limiting to prevent spam
- Fully anonymous — no persistent user accounts

## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/anonymous-chat-backend.git
cd anonymous-chat-backend
```

2. Install Dependencies
```bash
npm install
```

3. Create an .env file
```bash
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
USER_ACCESS_PASSWORD=your_user_password
ADMIN_ACCESS_PASSWORD=your_admin_password
```

4. Run the server
```bash
npm run dev

```

## API & WebSocket Testing

- Test REST endpoints using Postman



## Live Deployment
You can view the live site at: https://anonymous-chat-backend-jdvh.onrender.com/

> **Note:** The database will expire on March 21st, 2026.
