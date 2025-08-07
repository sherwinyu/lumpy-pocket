#!/bin/sh

# Start backend API
PORT=4001 node server.js &

# Serve frontend on port 8080 with API proxy
serve -s public -l 8080 --no-clipboard \
  --rewrites '[{"source":"/api/**","destination":"http://localhost:4001/api/**"}]'