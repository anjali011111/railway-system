FROM node:18-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json* ./

RUN npm install --omit=dev

COPY backend/ .

EXPOSE 3000

CMD ["npm", "start"]
