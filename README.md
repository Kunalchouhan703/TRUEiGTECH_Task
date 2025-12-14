# Instagram Mini Clone

A complete Instagram Mini Clone built with Node.js backend and React frontend.

## Features

-  User authentication (Signup/Login with JWT)
-  Follow/Unfollow users
-  Create posts with image URL and caption
-  Like/Unlike posts
-  Add comments to posts
-  Feed showing posts from followed users only
-  User profiles with posts, followers, and following counts
-  Clean, modern UI

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- CORS enabled

### Frontend
- React (Vite)
- React Router
- Axios for API calls
- Custom CSS (no heavy UI libraries)

## Project Structure

```
ig clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   └── Comment.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── post.controller.js
│   │   │   └── feed.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── post.routes.js
│   │   │   └── feed.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Feed.jsx
    │   │   ├── CreatePost.jsx
    │   │   └── Profile.jsx
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/instagram-clone
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. Make sure MongoDB is running on your system.

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Sign up a new user
- `POST /api/auth/login` - Log in an existing user

### Users
- `GET /api/users/:userId` - Get user profile
- `POST /api/users/:targetUserId/follow` - Follow a user
- `POST /api/users/:targetUserId/unfollow` - Unfollow a user

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/user/:userId` - Get all posts by a user
- `POST /api/posts/:postId/like` - Like a post
- `POST /api/posts/:postId/unlike` - Unlike a post
- `POST /api/posts/:postId/comment` - Add a comment to a post
- `GET /api/posts/:postId/comments` - Get all comments for a post

### Feed
- `GET /api/feed` - Get feed (posts from users you follow)

**Note:** All routes except `/api/auth/*` require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Example API Requests

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Post (requires auth token)
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "imageUrl": "https://example.com/image.jpg",
    "caption": "My first post!"
  }'
```

### Get Feed (requires auth token)
```bash
curl -X GET http://localhost:5000/api/feed \
  -H "Authorization: Bearer <your-token>"
```

### Follow User (requires auth token)
```bash
curl -X POST http://localhost:5000/api/users/<target-user-id>/follow \
  -H "Authorization: Bearer <your-token>"
```

### Like Post (requires auth token)
```bash
curl -X POST http://localhost:5000/api/posts/<post-id>/like \
  -H "Authorization: Bearer <your-token>"
```

### Add Comment (requires auth token)
```bash
curl -X POST http://localhost:5000/api/posts/<post-id>/comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "text": "Great post!"
  }'
```

## Features Implementation

### Authentication
- Passwords are hashed using bcrypt before storing
- JWT tokens are generated on successful login/signup
- Tokens expire after 7 days
- Protected routes verify JWT token

### Database Design
- **User Schema**: username, email, password (hashed), followers, following arrays
- **Post Schema**: user reference, imageUrl, caption, likes array, createdAt
- **Comment Schema**: user reference, post reference, text, createdAt
- Proper indexes for efficient querying
- Referential integrity maintained

### Edge Cases Handled
-  Duplicate likes prevented
-  Can't follow yourself
-  Can't follow same user twice
-  Can't like same post twice
-  Proper error handling for all routes
-  Input validation
-  Authentication checks on protected routes

### Feed Optimization
- Only shows posts from users you follow
- Latest posts first
- Efficient MongoDB queries with indexes
- Limited to 50 posts for performance

## Running the Application

1. Start MongoDB (if running locally)
2. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
3. Start the frontend server (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser

## Notes

- Make sure MongoDB is running before starting the backend
- Change the JWT_SECRET in production
- The frontend expects the backend to run on port 5000
- Image URLs should be publicly accessible for posts
- All API responses follow consistent JSON format

## License

This project is for educational purposes.

