#!/bin/bash
set -e

WORKSPACE_DIR="/Users/richard/.gemini/antigravity/worktrees/MyRich kid/verify-soulamar-repo-connection"
NODE_DIR="$WORKSPACE_DIR/.node"

echo "=== 1. Checking if Node.js is already downloaded locally ==="
if [ ! -d "$NODE_DIR" ]; then
    echo "Downloading precompiled Node.js v20.12.2 for macOS x64..."
    mkdir -p "$NODE_DIR"
    curl -L https://nodejs.org/dist/v20.12.2/node-v20.12.2-darwin-x64.tar.gz -o "$WORKSPACE_DIR/node.tar.gz"
    echo "Extracting Node.js..."
    tar -xzf "$WORKSPACE_DIR/node.tar.gz" -C "$NODE_DIR" --strip-components=1
    rm "$WORKSPACE_DIR/node.tar.gz"
    echo "Node.js successfully downloaded and extracted."
fi

# Add local node/npm binaries to PATH
export PATH="$NODE_DIR/bin:$PATH"

echo "=== 2. Verifying Node.js version ==="
node -v
npm -v

echo "=== 3. Running npm install ==="
npm install

echo "=== 4. Starting development server on port 3000 ==="
npm run dev
