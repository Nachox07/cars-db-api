FROM node:14.16.1-alpine

ENV DOCROOT=/usr/local/cars-db-api/
ENV NODE_ENV='production'

WORKDIR ${DOCROOT}

COPY ./dist .

RUN yarn --frozen-lockfile

CMD [ "node", "index.js" ]
