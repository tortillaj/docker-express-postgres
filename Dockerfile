FROM node:22-alpine
WORKDIR /usr/local/apps/myapp/dev

COPY package.json ./
RUN npm install && npm cache clean --force

COPY tsconfig.json ./

COPY src ./src
COPY .env ./

EXPOSE ${PORT}

RUN npm run build
CMD ["npm", "run", "start:watch"]
