import { Application } from 'express';
import taskmanagerClientRouter from './api/controllers/examples/router'
export default function routes(app: Application): void {
  app.use('/api/v1/taskmanagerClient', taskmanagerClientRouter);
};
