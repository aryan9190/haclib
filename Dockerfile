FROM node:20

WORKDIR /app

COPY backend/package*.json ./backend/

WORKDIR /app/backend
RUN npm install

COPY backend ./backend

COPY frontend ./backend/public

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
