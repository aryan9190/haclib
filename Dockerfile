# Use official Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Copy backend files and install dependencies
COPY backend ./backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Copy frontend files into /frontend
WORKDIR /app
COPY frontend ./frontend

# Set environment variables (can override in Nest or Docker CLI)
ENV PORT=3000

# Expose app port
EXPOSE 3000

# Start the backend server
WORKDIR /app/backend
CMD ["node", "server.js"]
