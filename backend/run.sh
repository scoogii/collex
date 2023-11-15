#!/bin/bash

docker container rm -f collex-backend
docker run --name collex-backend --rm -v "$(pwd)/app:/app" -v "$(pwd)/tests:/tests" --publish 8080:5000 -it collex-backend

