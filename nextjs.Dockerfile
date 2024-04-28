FROM node:21.7.1-slim
LABEL authors="ARDI"
RUN apt-get update && apt-get install -y curl
RUN mkdir -p /app
WORKDIR /app
COPY ./client .
RUN npm i
RUN npm run build
CMD [ "npm", "run", "start" ]