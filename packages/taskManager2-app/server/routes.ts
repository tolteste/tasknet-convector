import { Application } from 'express';
import taskmanagerClient2Router from './api/controllers/examples/router'
export default function routes(app: Application): void {
  app.use('/api/v1/taskmanagerClient2', taskmanagerClient2Router);
};
