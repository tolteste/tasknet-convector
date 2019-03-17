import yup from 'yup';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { Task, User, TaskState } from './taskManager.model';
import { stringify } from 'querystring';

@Controller('taskManager')
export class TaskManagerController extends ConvectorController {
  /**
   * @param title Shortly describes a specified task
   * @param description Provides more detailed description of a task
   * @returns Created task
   */
  @Invokable()
  public async create(
    @Param(yup.string().required().trim())
    title: string,
    @Param(yup.string().required().trim())
    description: string
  ) {
    const sender = this.sender
    let task = new Task();
    // Task initialization
    task.title = title;
    task.description = description;
    task.state = TaskState.MODIFIABLE;
    task.created = Date.now();
    // Creator is set to a certificate fingerprint of a sender
    task.creator = this.sender;
    await task.save();
  }

  @Invokable()
  public async modify(
    @Param(yup.string())
    id: string,
    @Param(yup.string())
    title: string,
    @Param(yup.string())
    description: string
  ) {
    const task = await Task.getOne(id);
    if (task.creator !== this.sender) {
      throw new Error('Only creator of the task is able to make modifications.')
    }

    if (title.length > 0) {
      task.title = title;
    }
    if (description.length > 0) {
      task.description = description;
    }

    return task.save();
  }
}
