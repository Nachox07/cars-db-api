# cars-db-api

## Introduction

This repository contains an implementation for a cars database API backend service. It is an interface for performing CRUD operations on a MongoDB database `cars-db` with a collection `cars`. It is composed of cars information. The tech stack used is the following:

- Express with Typescript
- Dotenv for config handling
- Pino as the logger
- Jest and Supertest for unit and integration tests
- Mongoose to interact with MongoDB
- AJV for request data validation

## Data models and endpoints

The type definitions and Mongoose models can be found under `./src/models` folder. For getting detailed information about models and endpoints, have a look at the Swagger file. It can be accessed in the development environment under the `/api-docs` path.

## Prerequisites

- Node.JS version equal to or greater 14.16
- Yarn version equal to or greater 1.22

## How-To

### Do the setup

- clone the [cars-db-api repository](https://github.com/Nachox07/cars-db-api)
- switch to ./cars-db-api repository folder
- run `yarn` for installing the dependencies

### Run it with Docker (recommended)

This is the recommended option as it is quick and safe to run the whole API plus DB

#### docker-compose

It is prepared to create a Docker container with the Dockerfile app plus a Mongo DB running.

To build the app and copy `./dist` to Docker:

`yarn build`

To launch the app along with the Mongo DB instance:

`docker-compose up`

### Run it locally and create the configuration file

For running it locally, the requisite is to have a Mongo DB instance running. The Mongo DB URL can be defined as an env var:

`DATABASE_URL='mongodb://localhost:27017/cars-db'`

Create a `.env` with the desired config to initiate the API:

```sh
API_KEY='123456'
DATABASE_URL='mongodb://localhost:27017/cars-db'
```

Run the following commands to execute the app for development. It will reload on file change:

`yarn start:dev`

To run the app built run:

`yarn start`

It will build and run the app

### Build the app

To build the app and create a `./dist` run:

`yarn build`

### Run tests

#### Test linter

`yarn test:lint`

#### Test types

`yarn test:types`

#### Unit tests

`yarn test:unit`

#### Integration tests

`yarn test:integration`

#### Run all tests

`yarn test`

### Get coverage report

In order to get coverage with unit and integration tests together, run:

`yarn cover:report`

### Format every file with Prettier

`yarn prettier:fix`

### Clean dist folder and installation

#### To clean the installation

`yarn clean:installation`

#### To clean the Build

`yarn clean:build`
