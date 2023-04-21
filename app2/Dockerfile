FROM node:16.9.1-alpine3.14
WORKDIR /app
COPY package.json index.js /app/
RUN npm install
RUN npm install -g nodemon
CMD ["nodemon", "index.js"]