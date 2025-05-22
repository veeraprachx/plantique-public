#!/bin/bash

# Exit the script if any command fails
set -e

FRONTEND_IMAGE="__FRONTEND_IMAGE__"
BACKEND_IMAGE="__BACKEND_IMAGE__"

# Build and push the frontend image
echo "Building and pushing frontend image..."
cd frontend/
docker build --target production -t $FRONTEND_IMAGE .
docker push $FRONTEND_IMAGE
cd ..

# Build and push the backend image
echo "Building and pushing backend image..."
cd backend/
docker build --target production -t $BACKEND_IMAGE .
docker push $BACKEND_IMAGE
cd ..

echo "All images built and pushed successfully"

# Update production
cd production/
./deploy-command.sh 
cd ..

