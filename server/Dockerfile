FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npx prisma generate

# Dont EXPOSE when using the Docker Compose
# EXPOSE 5000

# Dont CMD when using (command: sh -c "npx prisma migrate deploy && node --watch server.js") in docker-compose
# CMD ["node", "--watch", "server.js" ]
# OR
# CMD [ "npx", "prisma", "migrate", "deploy", "&&", "node", "--watch", "server.js" ]