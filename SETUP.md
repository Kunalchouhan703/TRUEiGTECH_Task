Quick Start Guide

Before you begin, ensure you have Node.js installed and MongoDB running on your system. You'll also need a package manager like npm or yarn.

Backend Setup

Go to the backend directory and install dependencies. Create a .env file with your configuration settings including the database connection and secret keys. Start MongoDB if running locally. Launch the backend server using npm start. The server will be available at the configured port.

Frontend Setup

Open a new terminal window and navigate to the frontend directory. Install all required packages. Start the development server. The application will open automatically in your browser.

Using the Application

Open your browser and navigate to the frontend URL. Create a new account by signing up. Once logged in, you can start creating posts, following users, and interacting with content.

Common Issues

If you see database connection errors, verify that MongoDB is running and the connection string is correct. For port conflicts, change the port number in the configuration. CORS errors usually mean the backend isn't running or isn't configured properly. Authentication problems can often be solved by clearing browser storage and checking token configuration.

Testing

You can test the API using tools like Postman or curl commands. Check the main README for example API requests. The browser developer tools network tab is also useful for debugging API calls.

Default Settings

The backend typically runs on port 5000. The frontend runs on port 3000. The default database connection points to a local MongoDB instance. These can be changed in the configuration files.

Next Steps

After setup, create your first account. Upload a post with an image. Find and follow other users. Explore the feed to see posts from people you follow. Try liking and commenting on posts.
