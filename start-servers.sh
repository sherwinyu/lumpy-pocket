#!/bin/bash

# Start backend server in background
echo "Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Start frontend server in background
echo "Starting frontend server..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "Backend server PID: $BACKEND_PID"
echo "Frontend server PID: $FRONTEND_PID"

# Save PIDs to file for easy cleanup
echo $BACKEND_PID > .server-pids
echo $FRONTEND_PID >> .server-pids

echo "Servers started! Backend on http://localhost:4001, Frontend on http://localhost:4000"
echo "To stop servers, run: kill \$(cat .server-pids)"