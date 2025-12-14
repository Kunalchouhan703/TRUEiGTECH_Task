Project Installation Guide

This guide will help you set up the Instagram clone project on your computer. The project uses Node.js for both the backend and frontend, so you'll need Node.js installed first.

Prerequisites

Make sure you have Node.js version 14 or higher installed. You can check by running node --version in your terminal. You also need npm which comes with Node.js. MongoDB should be installed and running on your system, or you can use MongoDB Atlas cloud service.

Quick Installation

For Windows users, run the install.ps1 script in PowerShell. For Mac or Linux users, run the install.sh script in your terminal. These scripts will automatically install all dependencies for both backend and frontend.

Manual Installation

If you prefer to install manually, start with the backend. Navigate to the backend folder and run npm install to download all required packages. Then create a .env file in the backend folder with your configuration settings. For the frontend, go to the frontend folder and run npm install to get all frontend dependencies.

Environment Configuration

Create a .env file in the backend directory. Copy the contents from .env.example if it exists. Set your MongoDB connection string. Add a secure JWT secret key. Configure the port number if needed. The .env file should not be committed to version control for security reasons.

Starting the Application

First, make sure MongoDB is running on your system. Start the backend server by going to the backend directory and running npm start. In a new terminal window, navigate to the frontend directory and run npm run dev. Open your browser and visit the frontend URL to see the application.

Verification

After installation, verify everything works by checking that both servers start without errors. Try creating an account to test the authentication. Create a test post to verify the database connection. Check the browser console for any frontend errors.

Common Installation Issues

If npm install fails, try clearing the npm cache with npm cache clean --force. For permission errors on Mac or Linux, you might need to use sudo. Network issues can sometimes be resolved by using a different npm registry. If MongoDB connection fails, verify your connection string is correct.

