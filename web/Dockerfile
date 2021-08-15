FROM node:alpine

# Add the following line 
ENV CI=true

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent

COPY . .

CMD ["npm", "start"]