Backend Server Documentation

This is the server component of the Instagram clone application. It handles all the backend logic including user authentication, database operations, and API endpoints.

Setup Process

Install all required packages by running npm install in this directory. Create a .env file with your configuration including the database connection string and JWT secret key. Make sure MongoDB is running before starting the server. Use npm start to run the server or npm run dev for development with automatic reloading.

Available Endpoints

Authentication endpoints allow users to create accounts and log in. User endpoints provide profile information, follow functionality, and profile updates. Post endpoints handle creating posts, interactions like likes and comments, sharing as stories, editing captions, and deleting posts. Story endpoints manage story creation, viewing stories from followed users, and story deletion. Highlight endpoints allow creating highlights from stories and viewing highlight collections. Feed endpoint returns posts from followed users. Search endpoints help users find other accounts and get user suggestions.

All protected endpoints require authentication. Include the JWT token in the Authorization header as Bearer token when making requests to these endpoints.
