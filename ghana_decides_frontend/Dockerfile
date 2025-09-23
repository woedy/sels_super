# Use a Node.js base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies using Yarn
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of your application
COPY . .

# Build the React app
RUN yarn build

# Install serve to serve the app
RUN yarn global add serve

# Start the app
CMD ["serve", "-s", "build", "-l", "5000"] 
