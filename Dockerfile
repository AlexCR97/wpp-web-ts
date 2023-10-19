# Use the official Node.js v18 image as a base
FROM node:18

# More info at: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

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
