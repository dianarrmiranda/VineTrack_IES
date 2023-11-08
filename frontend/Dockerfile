FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY yarn*.lock ./
RUN npm install
COPY . .
EXPOSE 3030
CMD ["npm", "start"]