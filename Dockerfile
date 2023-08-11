# Use the official Node.js v18 image as a base
FROM node:18

# Create a working directory for the app
WORKDIR /app

# Copy .env into /app
# COPY .env ./

# Copy package.json and package-lock.json into /app
COPY package*.json ./

# Copy tsconfig.json into /app
COPY tsconfig.json ./
COPY tsconfig.compile.json ./

# Copy /src into /app/src
COPY /src ./src

# Install dependencies
RUN npm install

# Build typescript
RUN npm run compile-build

# Start the application (run the /app/main.js)
CMD ["npm", "start"]
