# VideoTube

## Overview

This is a Node.js backend application using Express and MongoDB (via Mongoose) for a user-centric platform that supports authentication, user profiles, video management, and subscriptions. It features JWT-based authentication with access and refresh tokens, file uploads (avatars, cover images), and user watch history.

---

## Features

- **User Registration & Authentication**: Secure registration and login with hashed passwords and JWT tokens (access and refresh).
- **Profile Management**: Users can update their account details, avatar, and cover image.
- **Watch History**: Tracks videos watched by users.
- **Subscriptions**: Users can subscribe to other users (channels).
- **Video Management**: Videos have metadata (title, description, duration, etc.) and are associated with users.
- **Cloudinary Integration**: For storing user avatars and cover images.
- **Robust Error Handling**: Custom error and response utilities.
- **Middleware**: For authentication (JWT), file uploads (Multer), and CORS.

---

## Tech Stack

- **Node.js** (Express)
- **MongoDB** (Mongoose)
- **JWT** for authentication
- **Cloudinary** for media storage
- **Multer** for file uploads
- **bcrypt** for password hashing
- **dotenv** for environment management

---

## Data Models

### User
- `username`, `email`, `fullName`, `avatar`, `coverImage`
- `watchHistory` (references Video)
- `password` (hashed)
- `refreshToken` (for JWT refresh)

### Video
- `videoFile`, `thumbnail`, `title`, `description`, `duration`, `views`, `isPublished`
- `owner` (references User)

### Subscription
- `subscriber` (User)
- `channel` (User)

---

## API Endpoints

All endpoints are prefixed with `/api/v1/users`:

- `POST /register` — Register a new user (with avatar and optional cover image)
- `POST /login` — User login
- `POST /logout` — Logout (requires JWT)
- `POST /refresh-token` — Refresh access token
- `POST /change-password` — Change password (requires JWT)
- `GET /getUser-details` — Get current user details (requires JWT)
- `PATCH /update-account` — Update email/username (requires JWT)
- `PATCH /update-avatar` — Update avatar (requires JWT)
- `PATCH /update-coverImage` — Update cover image (requires JWT)
- `GET /c/:username` — Get user channel profile (requires JWT)
- `GET /watch-history` — Get user watch history (requires JWT)

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vishal-Github-21/mega_project.git
   cd mega_project
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory with the following variables:
     ```env
     MONGODB_URI=<your-mongodb-uri>
     DB_NAME=<your-db-name>
     ACCESS_TOKEN_SECRET=<your-access-token-secret>
     REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
     CORS_ORIGIN=<your-frontend-url>
     CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
     CLOUDINARY_API_KEY=<your-cloudinary-api-key>
     CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
     ```

### Running the App

Start the development server with nodemon:

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 8000).

---

## Project Structure

```
src/
  app.js                # Express app setup and middleware
  index.js              # Entry point, DB connection, server start
  controllers/          # Business logic (user, auth, etc.)
  models/               # Mongoose models (User, Video, Subscription)
  routes/               # API route definitions
  middlewares/          # Auth, file upload, etc.
  utils/                # Error and response utilities
  db/                   # DB connection logic
public/
  temp/                 # Temporary file storage for uploads
```

---

## Notes

- Passwords are securely hashed with bcrypt.
- Access tokens are not stored in the DB; refresh tokens are.
- Uses aggregate-paginate-v2 for advanced Mongoose queries.
- All file uploads are handled via Multer and stored in Cloudinary.

---

**Author:** Vishal Mukkannavar
