FROM node:alpine as BUILD_IMAGE
WORKDIR /app
COPY package.json package-lock.json ./
# install dependencies
RUN npm install --omit-dev
COPY . .
# build
RUN npm run build
# remove dev dependencies
FROM node:alpine
WORKDIR /app
# copy from build image
COPY --from=BUILD_IMAGE /app ./
EXPOSE 3000
CMD ["npm", "start"]