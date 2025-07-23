FROM node:20
WORKDIR /app
COPY backend/package*.json ./backend/
COPY backend/.env ./backend/.env
COPY backend ./backend
WORKDIR /app/backend
RUN npm install
WORKDIR /app
COPY frontend ./frontend
ENV PORT=3000
EXPOSE 3000
WORKDIR /app/backend
CMD ["node", "server.js"]
