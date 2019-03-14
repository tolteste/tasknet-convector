import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { TaskManager } from './taskManager.model';

@Controller('taskManager')
export class TaskManagerController extends ConvectorController {
  @Invokable()
  public async create(
    @Param(TaskManager)
    taskManager: TaskManager
  ) {
    await taskManager.save();
  }
}