import express, { Application } from 'express';

const configureMiddlewares = async (app: Application) => {
  app.use(express.json());
};

export default configureMiddlewares;
