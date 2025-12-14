Instagram Clone Project

This is a social media application similar to Instagram where users can share photos, follow each other, and interact with posts. The project consists of two main parts - a backend server built with Node.js and a frontend interface built with React.

What This App Does

Users can create accounts and log in securely. Once logged in, they can upload photos with captions, follow other users, like posts, and leave comments. The feed shows posts from people you follow. You can create and view stories that expire after 24 hours. Stories can be saved as highlights on your profile. You can search for users with search history tracking. The application includes sidebars with stories feed and user suggestions. You can share posts as stories. Profile editing allows updating username, bio, and profile photo.

Technology Used

The backend uses Node.js with Express framework to handle all the server logic. It connects to MongoDB database to store user information, posts, and comments. Authentication is handled using JWT tokens. The frontend is built with React using Vite for fast development. It uses Axios to communicate with the backend API.

Project Organization

The code is organized into two main folders. The backend folder contains all server-side code including database models, API routes, and business logic. The frontend folder contains the React application with pages, components, and styling.

Getting Started

First, make sure you have Node.js installed on your computer. You also need MongoDB running either locally or through a cloud service like MongoDB Atlas.

To set up the backend, navigate to the backend folder and run npm install to get all required packages. Create a file named .env and add your database connection string and a secret key for JWT tokens. Then start the server with npm start.

For the frontend, go to the frontend folder and run npm install. Then start the development server with npm run dev. The application will open in your browser.

How to Use

After starting both servers, open the application in your browser. Create a new account by providing a username, email, and password. Once logged in, you can create posts by uploading images or providing image URLs. You can search for other users and follow them to see their posts in your feed. Click on posts to like them or add comments. Visit profiles to see all posts from a specific user.

API Information

The backend provides several API endpoints. Authentication endpoints allow users to sign up and log in. User endpoints let you view profiles, manage follow relationships, and update profile information. Post endpoints handle creating posts, liking, commenting, sharing as stories, editing captions, and deleting posts. Story endpoints manage story creation, viewing, and deletion. Highlight endpoints allow converting stories to permanent highlights. Feed endpoint returns posts from users you follow. Search endpoints help find users and get suggestions. All endpoints except authentication require a valid JWT token in the request headers.

Important Notes

Make sure MongoDB is running before starting the backend server. The JWT secret key should be changed in production environments. The frontend expects the backend to run on port 5000 by default. Image URLs used in posts must be publicly accessible. All API responses follow a consistent JSON format for easy handling.
