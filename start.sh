#!/bin/bash

echo "🚀 Starting December with CodeSandbox integration..."

# Copy config file to backend directory
echo "📋 Copying configuration..."
cp config.ts backend/config.ts

# Check if we should use npm or bun
if command -v bun &> /dev/null; then
    echo "🥖 Bun detected - using Bun for faster performance"
    BACKEND_CMD="bun src/index.ts"
    FRONTEND_CMD="bun dev"
else
    echo "📦 Using npm"
    BACKEND_CMD="npm run dev"
    FRONTEND_CMD="npm run dev"
fi

echo "🔧 Starting backend server..."
cd backend && $BACKEND_CMD &
BACKEND_PID=$!

echo "🎨 Starting frontend server..."
cd ../frontend && $FRONTEND_CMD &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:4000"
echo ""
echo "💡 Using CodeSandbox for instant project creation (no Docker required!)"
echo "🛑 Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait