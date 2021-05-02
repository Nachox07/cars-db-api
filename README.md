- [cars-db-api](#cars-db-api)
  - [Introduction](#introduction)
  - [Data models and endpoints](#data-models-and-endpoints)
  - [Architecture](#architecture)
    - [Folder structure and files](#folder-structure-and-files)
    - [Error handling](#error-handling)
  - [CI/CD](#ci-cd)
    - [Continuous Integration workflow](#continuous-integration-workflow)
    - [Continuous Deployment workflow](#continuous-deployment-workflow)
  - [Prerequisites](#prerequisites)
  - [How-To](#how-to)
    - [Do the setup](#do-the-setup)
    - [Run it with Docker (recommended)](#run-it-with-docker--recommended-)
      - [docker-compose](#docker-compose)
    - [Run it locally and create the configuration file](#run-it-locally-and-create-the-configuration-file)
    - [Build the app](#build-the-app)
    - [Run tests](#run-tests)
      - [Test linter](#test-linter)
      - [Test types](#test-types)
      - [Unit tests](#unit-tests)
      - [Integration tests](#integration-tests)
      - [Run all tests](#run-all-tests)
    - [Get coverage report](#get-coverage-report)
    - [Format every file with Prettier](#format-every-file-with-prettier)
    - [Clean dist folder and installation](#clean-dist-folder-and-installation)
      - [To clean the installation](#to-clean-the-installation)
      - [To clean the Build](#to-clean-the-build)

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

## Architecture

The app is an API Restful composed of routes, controllers and model based on the product. In this case, a CRUD interface for a cars database with the possibility to be extended and escalated. It can be run as a microservice with several instances pointing to a Mongo DB cluster.

### Folder structure and files

The structure hierarchy is important to understand and to be followed as it is part of its architecture. It is the following:

- `src` contains the app sources
  - `__tests__` contain the unit tests for the files, with `.test.ts` extension
  - `controllers` contain business logic that interacts with the Mongoose models performing CRUD operations
  - `db` contains the DB connection
  - `middlewares` contain the ExceptionHandler and Authorization Handler middlewares plus config adding others such as Swagger and Helmet
  - `models` contain the Mongoose model plus types
  - `config.ts` single point with all the app configuration variables extracted with dotenv and default values
  - `routes.ts` contain the API endpoints with response and exceptions to throw based on controller logic. Can be split to follow the controllers scheme
  - `server.ts` initialise the server and do configurations plus DB connection
  - `validations` contain the validator logic and schemas
- `test` contains tests utils and mocks along with the integration tests
  - `integration` are integration tests
  - `mocks.ts` contain mocks for Mongoose and other dependencies
  - `utils.ts` group of utils to perform the unit tests

### Error handling

It is centralised by the `exceptionHandler.ts` middleware where `exceptions.ts` thrown are mapped to status code and response message error. Then the response and error logging is done. It is recommended to throw every error with this flow.

## CI/CD

### Continuous Integration workflow

The following GitHub workflow is running in every push to `main` branch:

- `build-and-test` in charge of build and testing the app. It generates the report coverage as well.

### Continuous Deployment workflow

- TBD

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

It is prepared to create a Docker container with the Dockerfile app plus a Mongo DB instance running.

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
