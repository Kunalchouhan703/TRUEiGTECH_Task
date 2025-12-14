#!/bin/bash

echo "Installing Instagram Clone Project Dependencies"
echo ""

echo "Installing Backend Dependencies..."
cd backend
if [ -d "node_modules" ]; then
    echo "Backend node_modules already exists. Skipping..."
else
    npm install
    if [ $? -eq 0 ]; then
        echo "Backend dependencies installed successfully!"
    else
        echo "Failed to install backend dependencies"
        exit 1
    fi
fi
cd ..

echo ""
echo "Installing Frontend Dependencies..."
cd frontend
if [ -d "node_modules" ]; then
    echo "Frontend node_modules already exists. Skipping..."
else
    npm install
    if [ $? -eq 0 ]; then
        echo "Frontend dependencies installed successfully!"
    else
        echo "Failed to install frontend dependencies"
        exit 1
    fi
fi
cd ..

echo ""
echo "Checking for .env files..."

if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env from .env.example..."
    cp backend/.env.example backend/.env
    echo "Please update backend/.env with your actual configuration"
else
    echo "Backend .env file already exists"
fi

echo ""
echo "Installation Complete!"
echo ""
echo "Next Steps:"
echo "1. Update backend/.env with your MongoDB connection string and JWT secret"
echo "2. Make sure MongoDB is running"
echo "3. Start backend: cd backend && npm start"
echo "4. Start frontend: cd frontend && npm run dev"

