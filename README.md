# Instagram Clone

Social media app built with Node.js and React. Share photos, follow friends, post stories, and connect with others.

## What's Inside

Features:

- **Photo Sharing** - Upload images from your device or use URLs to share moments
- **Stories** - 24-hour temporary posts that disappear automatically
- **Highlights** - Save your favorite stories permanently on your profile
- **Social Features** - Follow users, like posts, leave comments
- **User Profiles** - Custom profile pictures, bios, and post galleries
- **Search & Discovery** - Find new people to follow with search history
- **User Suggestions** - Discover accounts you might want to follow
- **Interactive Feed** - See posts from people you follow
- **Post Management** - Edit captions, delete posts, share posts as stories

## Quick Start

### What You Need

- Node.js 14 or newer
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager
- Basic terminal knowledge

### Backend Setup

1. **Get the code**

   ```bash
   git clone https://github.com/Kunalchouhan703/TRUEiGTECH_Task.git
   cd TRUEiGTECH_Task
   ```

2. **Go to backend directory**

   ```bash
   cd backend
   ```

3. **Install packages**

   ```bash
   npm install
   ```

4. **Create environment file**

   Create a `.env` file in the backend directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/instagram-clone
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

5. **Make sure MongoDB is running**

   - If using local MongoDB, start the service
   - If using MongoDB Atlas, use your connection string in MONGODB_URI

6. **Start the server**

   ```bash
   npm start
   ```

The backend will be running at `http://localhost:5000`

### Frontend Setup

1. **Open a new terminal and go to the frontend folder**

   ```bash
   cd frontend
   ```

2. **Install packages**

   ```bash
   npm install
   ```

3. **Start the app**

   ```bash
   npm run dev
   ```

The app will open at `http://localhost:5173` (Vite default port)

## How to Use

### Getting Started

1. Open `http://localhost:5173` in your browser
2. Sign up for a new account with username, email, and password
3. Start sharing photos and following people

### Main Features

**Posting Photos**

- Click "Create" in the navigation
- Choose to upload from device or use an image URL
- Add a caption and share
- View your posts on your profile

**Stories**

- Click "Add Story" in the sidebar or create post page
- Upload an image or use an image URL
- Stories automatically expire after 24 hours
- View stories from people you follow in the left sidebar
- Share existing posts as stories using the share button

**Highlights**

- Convert your stories into permanent highlights
- Add custom titles to organize your highlights
- Highlights appear on your profile below your stats
- Click on highlights to view all stories in that collection

**Profile Setup**

- Go to your profile page
- Click "Edit Profile" button
- Upload a profile picture, update username, and add a bio
- View your posts in a grid layout
- See your followers and following lists

**Social Interaction**

- Like posts by clicking the heart icon
- Leave comments on any post
- Follow users from search results or their profiles
- View who liked your posts
- Delete your own comments or comments on your posts
- Edit captions on your own posts

**Search & Discovery**

- Use the search page to find users by username
- View your search history for quick access
- Explore suggestions in the right sidebar
- Follow users directly from search results

## Project Structure

```
TRUEiGTECH_Task/
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── models/             # MongoDB schemas (User, Post, Comment, Story, Highlight)
│   │   ├── controllers/       # Business logic
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/        # Authentication and upload handlers
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── uploads/               # Uploaded images storage
│   └── package.json           # Backend dependencies
│
└── frontend/                   # React frontend
    ├── src/
    │   ├── api/               # Axios configuration
    │   ├── components/         # Reusable components (Navbar, Layout)
    │   ├── pages/              # Page components
    │   ├── App.jsx            # Main app component
    │   └── index.css          # Global styles
    └── package.json           # Frontend dependencies
```

## Tech Stack

**Backend**

- Node.js - JavaScript runtime
- Express.js - Web framework
- MongoDB - Database
- Mongoose - Database modeling
- JWT - User authentication
- bcrypt - Password hashing
- Multer - File upload handling
- CORS - Cross-origin resource sharing

**Frontend**

- React - User interface library
- Vite - Build tool and dev server
- React Router - Navigation
- Axios - API requests
- Custom CSS - Styling

## Development Tips

**Adding New Features**

- Backend changes go in `backend/src/`
- Frontend components go in `frontend/src/components/` or `frontend/src/pages/`
- API endpoints are defined in `backend/src/routes/`

**File Uploads**

- Images are stored in `backend/uploads/`
- Both file uploads and URLs are supported
- File size limit is 5MB
- Supported formats: jpeg, jpg, png, gif, webp

**Database Changes**

- Modify models in `backend/src/models/`
- Mongoose handles schema changes automatically
- Restart the server after model changes

**Environment Variables**

- Backend uses `.env` file for configuration
- Copy `.env.example` to `.env` and fill in your values
- Never commit `.env` file to version control

## Troubleshooting

**Backend won't start**

- Make sure MongoDB is running
- Check that port 5000 isn't already in use
- Verify `.env` file exists with correct MONGODB_URI
- Run `npm install` to ensure all packages are installed

**Frontend won't start**

- Run `npm install` to make sure all packages are installed
- Check that port 5173 isn't already in use
- Verify backend is running on port 5000

**Images not loading**

- Make sure the backend server is running
- Check that the `uploads` folder exists in backend directory
- Verify image URLs are publicly accessible if using URLs

**Can't upload files**

- Verify Multer is installed: `npm install multer`
- Check file size (must be under 5MB)
- Make sure the file is a valid image format
- Check browser console for errors

**Authentication issues**

- Clear browser localStorage
- Verify JWT_SECRET is set in backend `.env`
- Check that token is being sent in request headers
- Try logging out and logging back in

**Database connection errors**

- Verify MongoDB is running
- Check MONGODB_URI in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted
- Test connection string format

## Production Notes

This setup is perfect for development and learning. For production use, you'd want to:

- Use a production database like MongoDB Atlas
- Set up proper file storage (AWS S3, Cloudinary, etc.)
- Configure environment variables securely
- Set up proper security headers and CORS policies
- Use a production web server (PM2, Nginx)
- Enable HTTPS
- Set up proper error logging and monitoring
- Implement rate limiting
- Add input validation and sanitization

## API Endpoints

**Authentication**
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login existing user

**Users**
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update your profile
- `POST /api/users/:targetUserId/follow` - Follow a user
- `POST /api/users/:targetUserId/unfollow` - Unfollow a user

**Posts**
- `POST /api/posts` - Create a new post
- `GET /api/posts/:postId` - Get post details
- `GET /api/posts/user/:userId` - Get user's posts
- `POST /api/posts/:postId/like` - Like a post
- `POST /api/posts/:postId/unlike` - Unlike a post
- `POST /api/posts/:postId/comment` - Add comment
- `GET /api/posts/:postId/comments` - Get comments
- `DELETE /api/posts/comments/:commentId` - Delete comment
- `PUT /api/posts/:postId/caption` - Edit caption
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/share-story` - Share post as story

**Stories**
- `POST /api/stories` - Create a story
- `GET /api/stories` - Get stories from followed users
- `GET /api/stories/user/:userId` - Get user's stories
- `DELETE /api/stories/:storyId` - Delete story

**Highlights**
- `POST /api/highlights` - Create highlight from stories
- `GET /api/highlights/user/:userId` - Get user's highlights
- `GET /api/highlights/:highlightId` - Get highlight stories
- `DELETE /api/highlights/:highlightId` - Delete highlight

**Feed & Search**
- `GET /api/feed` - Get posts from followed users
- `GET /api/search/users?query=username` - Search users
- `GET /api/search/suggestions` - Get user suggestions

## Contributing

Feel free to fork this project and make it your own. Some ideas for improvements:

- Video support for posts and stories
- Direct messaging between users
- Post sharing and reposting
- Advanced search and filtering
- Real-time notifications
- Mobile app version
- Image filters and editing
- Hashtag support
- Location tagging

## License

This project is open source and available for learning and personal use.
