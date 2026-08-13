FROM node:22-alpine

WORKDIR /usr/src/app

# Install deps first so this layer is cached unless package.json/yarn.lock change.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3333

CMD ["yarn", "dev"]
