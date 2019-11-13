# Use the base image with Node.js 10.17.0-jessie
FROM node:10.17.0-jessie

# Copy the current directory into the Docker image
COPY . /srm-problems-api

# Set working directory for future use
WORKDIR /srm-problems-api

# Install the dependencies from package.json
RUN npm install
ENTRYPOINT [ "npm" ]
