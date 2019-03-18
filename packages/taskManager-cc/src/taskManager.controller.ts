import * as yup from 'yup';
import * as uuid from 'uuid/v4'

import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { Task, User, TaskState } from './taskManager.model';
import { stringify } from 'querystring';
import { print } from 'util';

@Controller('taskManager')
export class TaskManagerController extends ConvectorController {
  /**
   * @param title Shortly describes a specified task
   * @param description Provides more detailed description of a task
   * @returns id of created task
   */
  @Invokable()
  public async create(
    @Param(yup.string().required().trim())
    title: string,
    @Param(yup.string().required().trim())
    description: string
  ) {
    var id = uuid();
    // Checking for colisions
    var exists = await Task.getOne(id)
    while (exists.id === id) {
      // Colision found => generate new uuid
      id = uuid();
    }

    let task = new Task(id);
    // Task initialization
    task.title = title;
    task.description = description;
    task.state = TaskState.MODIFIABLE;
    task.created = Date.now();
    // Creator is set to a certificate fingerprint of a sender
    task.creator = this.sender;
    await task.save();
    return id;
  }

  @Invokable()
  public async modify(
    @Param(yup.string())
    id: string,
    @Param(yup.string())
    title: string,
    @Param(yup.string())
    description: string,
    @Param(yup.array().of(yup.string()))
    prereq: string[] = ['']
  ) {
    const task = await Task.getOne(id);
    if (task.creator !== this.sender) {
      throw new Error('Only creator of the task is able to make modifications.')
    }

    if (title.length > 0) {
      task.title = title.trim();
    }
    if (description.length > 0) {
      task.description = description.trim();
    }

    //if(prereq.length > 0){
      //if(task.prerequisties.indexOf(id))
      //task.prerequisties = prereq;
   // }

    return task.save();
  }
}
