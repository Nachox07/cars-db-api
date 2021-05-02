FROM node:14.16.1-alpine

RUN apk add dumb-init

ENV DOCROOT=/usr/local/cars-db-api/
ENV NODE_ENV='production'
ENV API_KEY='123456'
ENV DATABASE_URL='mongodb://mongo-db:27017/cars-production-db'

WORKDIR ${DOCROOT}

COPY --chown=node:node ./dist package.json yarn.lock ./

RUN yarn --frozen-lockfile

USER node

CMD [ "dumb-init", "node", "-r", "dotenv/config", "index.js" ]
