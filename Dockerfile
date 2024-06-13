# Use the official Node.js image with LTS version
FROM node:16

# Create and change to the app directory
WORKDIR /usr/src/app

# Install TypeScript globally
RUN npm install -g typescript

# Install TSLint globally (optional, as it's deprecated in favor of ESLint with TypeScript)
RUN npm install -g tslint typescript-eslint/eslint-plugin @typescript-eslint/parser

# Copy package.json and yarn.lock if using Yarn (or package-lock.json if using npm)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build TypeScript code (adjust 'tsconfig.json' file name if necessary)
RUN tsc

# Expose the application port (if needed)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
