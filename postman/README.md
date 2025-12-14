# Postman Collection for Instagram Clone API

This directory contains the Postman collection for testing the Instagram Clone API.

## Files

- `Instagram Clone API.postman_collection.json` - Complete API collection with all endpoints

## Setup Instructions

### 1. Import Collection

1. Open Postman
2. Click **Import** button
3. Select `Instagram Clone API.postman_collection.json`
4. Collection will be imported with all endpoints

### 2. Create Environment (Recommended)

1. Click **Environments** in left sidebar
2. Click **+** to create new environment
3. Name it "Instagram Clone Local"
4. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:5000/api` | `http://localhost:5000/api` |
| `token` | (leave empty) | (leave empty) |
| `user_id` | (leave empty) | (leave empty) |

5. Click **Save**
6. Select this environment from the dropdown (top right)

### 3. Automatic Token Management

The collection includes **Test Scripts** that automatically:
- Save the JWT token after login/signup
- Save the user ID for easy reference
- Token is automatically used in all authenticated requests

### 4. Start Testing

1. **First**: Run **Signup** or **Login** request
   - Token will be automatically saved to environment
   - User ID will be automatically saved

2. **Then**: Use any other endpoint
   - All authenticated endpoints will use the saved token automatically

## Collection Structure

### Authentication
- **Signup** - Create new user account
- **Login** - Login existing user

### Users
- **Get User Profile** - Get user profile by ID
- **Update Profile** - Update current user's profile (username, bio, photo)
- **Follow User** - Follow a user
- **Unfollow User** - Unfollow a user

### Posts
- **Create Post (URL)** - Create post with image URL
- **Create Post (File Upload)** - Create post by uploading image file
- **Get Post by ID** - Get single post details
- **Get User Posts** - Get all posts by a user
- **Like Post** - Like a post
- **Unlike Post** - Unlike a post
- **Add Comment** - Add comment to a post
- **Get Comments** - Get all comments for a post
- **Delete Comment** - Delete a comment
- **Update Post Caption** - Update post caption
- **Delete Post** - Delete a post

### Feed
- **Get Feed** - Get posts from followed users

### Search
- **Search Users** - Search users by username

### Health Check
- **Health Check** - Check if server is running

## Usage Tips

1. **Update Variables**: 
   - Replace `:userId`, `:postId`, `:targetUserId`, `:commentId` in URL paths
   - Or use the collection variables

2. **File Uploads**:
   - For "Create Post (File Upload)" and "Update Profile", select a file in the Body tab
   - Supported formats: jpeg, jpg, png, gif, webp
   - Max size: 5MB

3. **Testing Flow**:
   ```
   1. Signup/Login → Get token
   2. Create Post → Get post ID
   3. Like Post → Use post ID
   4. Add Comment → Use post ID
   5. Get Feed → See all posts
   ```

## Example Request Bodies

### Signup
```json
{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
}
```

### Login
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### Create Post (URL)
```json
{
    "imageUrl": "https://example.com/image.jpg",
    "caption": "This is my first post!"
}
```

### Add Comment
```json
{
    "text": "Great post!"
}
```

### Update Post Caption
```json
{
    "caption": "Updated caption text"
}
```

## Notes

- All authenticated endpoints use Bearer token authentication
- Token is automatically included from environment variable
- Most endpoints require authentication (except signup, login, health check)
- File uploads use `multipart/form-data` format
- JSON requests use `application/json` content type

## Troubleshooting

1. **401 Unauthorized**: 
   - Make sure you've run Login/Signup first
   - Check that token is saved in environment
   - Verify token hasn't expired (tokens expire in 7 days)

2. **404 Not Found**:
   - Check that server is running on `http://localhost:5000`
   - Verify the endpoint URL is correct
   - Check that IDs in URL are valid

3. **400 Bad Request**:
   - Verify request body format is correct
   - Check required fields are provided
   - Validate data types match expected format

