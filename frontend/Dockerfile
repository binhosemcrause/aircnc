FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Bind to all interfaces and skip trying to open a host browser from inside the container.
ENV HOST=0.0.0.0
ENV BROWSER=none

EXPOSE 3000

CMD ["yarn", "start"]
