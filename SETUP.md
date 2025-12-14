# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher) installed
- MongoDB running locally or MongoDB Atlas account
- npm or yarn package manager

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example if available, or create manually)
# Add the following content:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/instagram-clone
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

# Start MongoDB (if running locally)
# On Windows: Make sure MongoDB service is running
# On Mac/Linux: mongod

# Start the backend server
npm start
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Access the Application

1. Open your browser and go to `http://localhost:3000`
2. Sign up for a new account
3. Create posts, follow users, like and comment!

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if the MONGODB_URI in .env is correct
- For MongoDB Atlas, use the connection string provided

### Port Already in Use
- Change the PORT in backend/.env
- Update the baseURL in frontend/src/api/axios.js to match

### CORS Errors
- Make sure backend is running before frontend
- Check that CORS is enabled in backend/src/app.js

### Authentication Issues
- Clear localStorage in browser
- Make sure JWT_SECRET is set in backend/.env
- Check browser console for errors

## Testing the APIs

You can test the APIs using:
- Postman
- curl commands (see README.md)
- Browser DevTools Network tab

## Default Configuration

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017/instagram-clone`

## Next Steps

1. Create your first account
2. Create a post with an image URL
3. Follow other users (create multiple accounts)
4. View your feed
5. Like and comment on posts

Enjoy building! 

