# Instagram Clone Backend

Node.js + Express backend for Instagram Mini Clone.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/instagram-clone
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Make sure MongoDB is running on your system.

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/login` - Log in

### Users
- `GET /api/users/:userId` - Get user profile
- `POST /api/users/:targetUserId/follow` - Follow a user
- `POST /api/users/:targetUserId/unfollow` - Unfollow a user

### Posts
- `POST /api/posts` - Create a post
- `GET /api/posts/user/:userId` - Get user's posts
- `POST /api/posts/:postId/like` - Like a post
- `POST /api/posts/:postId/unlike` - Unlike a post
- `POST /api/posts/:postId/comment` - Add comment
- `GET /api/posts/:postId/comments` - Get comments

### Feed
- `GET /api/feed` - Get feed (posts from followed users)

All routes except auth require authentication token in header:
```
Authorization: Bearer <token>
```

