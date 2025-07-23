FROM node:20

WORKDIR /app

COPY backend ./backend
COPY backend/.env ./backend/.env
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

WORKDIR /app
COPY frontend ./frontend

ENV PORT=3000

EXPOSE 3000

WORKDIR /app/backend
CMD ["node", "server.js"]
