# Use official Node.js image from the Docker Hub
FROM node:lts-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copy application code
COPY . .

# Expose the application port
EXPOSE 3000

# Adjust permissions for the `node` user
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]
