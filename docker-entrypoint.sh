#!/bin/bash
set -e

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until nc -z mongodb 27017; do
  sleep 1
done
echo "MongoDB is ready!"

# Start the application
echo "Starting NestJS application..."
if [ "$NODE_ENV" = "development" ]; then
  exec npm run start:dev
else
  exec npm run start:prod
fi

