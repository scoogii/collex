#!/bin/sh

echo "Initializing the database ..."
flask init-db

echo "Starting the application!"
exec "$@"
