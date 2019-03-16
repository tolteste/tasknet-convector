import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { Task, User } from './taskManager.model';

@Controller('taskManager')
export class TaskManagerController extends ConvectorController {
  @Invokable()
  public async create(
    @Param(Task)
    task: Task
  ) {
    await task.save();
  }
}
