FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build TypeScript to JavaScript
RUN npx tsc

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]
