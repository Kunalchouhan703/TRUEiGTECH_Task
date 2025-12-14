# Changelog - New Features Added

##  All Requested Features Implemented

### 1. Fixed Profile Posts Display
-  Posts now properly display in profile section
-  Added error handling for missing images
-  Posts show with proper grid layout

### 2. Photo Upload from Device
-  Added multer middleware for file uploads
-  Created uploads directory for storing images
-  Updated CreatePost page with file upload option
-  Users can now choose between:
   - Upload from device (file picker)
   - Use image URL (existing method)
-  Image preview before posting
-  File validation (image types only, 5MB max)

### 3. Like and Follow Buttons Visibility
-  Like buttons visible on all posts in Feed
-  Follow/Unfollow button visible on user profiles
-  Like status properly tracked (shows ❤️ if liked, 🤍 if not)
-  Follow status shown in search results

### 4. Search Functionality
-  New Search page added
-  Search users by username (case-insensitive, partial match)
-  Real-time search with debouncing
-  Follow/Unfollow directly from search results
-  Navigate to user profiles from search
-  Search link added to navbar

### 5. Followers/Following Lists
-  Click on followers/following count to view lists
-  Modal popup showing all followers
-  Modal popup showing all following
-  Click on any user to navigate to their profile
-  Lists show user avatars and usernames

## Technical Changes

### Backend
- Added `multer` package for file uploads
- Created `upload.middleware.js` for handling file uploads
- Created `search.controller.js` for user search
- Created `search.routes.js` for search endpoints
- Updated `post.controller.js` to support file uploads
- Updated `user.controller.js` to return `isFollowing` status
- Updated `post.controller.js` to return `isLiked` status for profile posts
- Added static file serving for uploaded images (`/uploads` route)
- Created `uploads/` directory for storing images

### Frontend
- Updated `CreatePost.jsx` with file upload UI
- Created new `Search.jsx` page
- Updated `Profile.jsx` with followers/following modals
- Updated `Navbar.jsx` with Search link
- Updated `App.jsx` with Search route
- Updated `axios.js` to handle FormData (file uploads)
- Added modal styles to `index.css`

## API Endpoints Added

### Search
- `GET /api/search/users?query=<username>` - Search users by username

### File Upload
- `POST /api/posts` - Now accepts both:
  - JSON with `imageUrl` (existing)
  - FormData with `image` file (new)

## How to Use New Features

### Upload Photo from Device
1. Go to "Create Post"
2. Click "Upload from Device" button
3. Select an image file
4. Preview will appear
5. Add caption and submit

### Search Users
1. Click "Search" in navbar
2. Type username in search box
3. Results appear in real-time
4. Click "Follow" to follow a user
5. Click on user to view their profile

### View Followers/Following
1. Go to any user's profile
2. Click on "followers" or "following" count
3. Modal shows the list
4. Click on any user to visit their profile

### Like Posts
1. Like buttons (🤍) visible on all posts in Feed
2. Click to like (changes to ❤️)
3. Click again to unlike
4. Like count updates in real-time

## File Structure Updates

```
backend/
├── src/
│   ├── middleware/
│   │   ├── upload.middleware.js (NEW)
│   ├── controllers/
│   │   ├── search.controller.js (NEW)
│   ├── routes/
│   │   ├── search.routes.js (NEW)
│   └── uploads/ (NEW - created automatically)

frontend/
├── src/
│   ├── pages/
│   │   ├── Search.jsx (NEW)
```

## Notes

- Uploaded images are stored in `backend/uploads/` directory
- Images are served at `http://localhost:5000/uploads/<filename>`
- Make sure to create `uploads` directory or it will be created automatically
- File size limit: 5MB
- Supported image formats: jpeg, jpg, png, gif, webp

