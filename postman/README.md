Postman Collection Guide

This folder contains a Postman collection file that includes all the API endpoints for testing the Instagram clone application.

Importing the Collection

Open Postman application on your computer. Click the import button in the interface. Select the collection JSON file from this folder. The collection will be imported with all endpoints ready to use.

Setting Up Environment Variables

Create a new environment in Postman for easier testing. Name it something like Instagram Clone Local. Add variables for the base URL, authentication token, and user ID. Save the environment and select it from the dropdown menu. This makes it easier to switch between different configurations.

Automatic Token Handling

The collection includes scripts that automatically save your authentication token after logging in. The user ID is also saved for convenience. All authenticated requests will use the saved token automatically without manual configuration.

Testing Workflow

Start by running the signup or login request to get an authentication token. The token will be saved automatically. Then you can use any other endpoint in the collection. All protected endpoints will use your saved token.

Collection Contents

The collection includes endpoints for authentication like signup and login. User endpoints let you view profiles, update your profile, and manage follow relationships. Post endpoints handle creating posts, viewing posts, liking, commenting, and managing posts. Feed endpoints show posts from users you follow. Search endpoints help you find other users. There's also a health check endpoint to verify the server is running.

Using the Collection

When testing, replace placeholder values in URLs like user IDs and post IDs with actual values from your responses. For file upload endpoints, select files in the body tab. Supported file formats include common image types. Maximum file size is 5MB. Follow a logical testing flow starting with authentication, then creating content, then interacting with it.

Example Request Formats

Signup requests need username, email, and password in the body. Login requests require email and password. Post creation can use either image URLs or file uploads. Comments require text content. Caption updates need the new caption text.

Important Notes

All protected endpoints require a valid authentication token. The token is automatically included from environment variables. Most endpoints need authentication except for signup, login, and health check. File uploads use multipart form data format. Regular requests use JSON content type.

Troubleshooting Tips

If you get unauthorized errors, make sure you've logged in first and the token is saved. For not found errors, verify the server is running and URLs are correct. Bad request errors usually mean the request body format is wrong or required fields are missing.
