import * as yup from 'yup';
import * as uuid from 'uuid/v4'

import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { Task, TaskState } from './taskManager.model';
import { Participant } from 'participant-cc';
import { stringify } from 'querystring';
import { print } from 'util';

@Controller('taskManager')
export class TaskManagerController extends ConvectorController {
  /**
   * @param title Shortly describes a specified task
   * @param description Provides more detailed description of a task
   * @param creatorId Participant.id that will be set as creator
   * @param prereq Array<string> with ids of all prerequisite tasks
   * @returns id of created task
   */
  @Invokable()
  public async create(
    @Param(yup.string().required().trim())
    title: string,
    @Param(yup.string().required().trim())
    description: string,
    @Param(yup.string())
    creatorId: string,
    @Param(yup.array().of(yup.string()))
    prereq: string[] = []
  ) {
    if (await !this.participantIsCaller(creatorId)) {
      throw new Error(`Participant with creatorId: ${creatorId} does not have identity of a current caller.`)
    }

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
    if (await this.arePrerequisitesValid(prereq)) {
      task.prerequisites = prereq;
    } else {
      return;
    }
    task.description = description;
    task.state = TaskState.MODIFIABLE;
    task.created = Date.now();
    task.creator = creatorId;
    await task.save();
    return id;
  }

  @Invokable()
  public async modify(
    @Param(yup.string())
    id: string,
    @Param(yup.string().trim())
    title: string,
    @Param(yup.string().trim())
    description: string,
    @Param(yup.array())
    prereq: string[] = []
  ) {
    const task = await this.getTask(id);

    if (await this.participantIsCaller(task.creator) !== true) {
      throw new Error('Only creator of the task is able to make modifications.');
    }

    if (task.state !== TaskState.MODIFIABLE) {
      throw new Error(`Can't modify a task that is not in MODIFIABLE state.`);
    }
    if (title.length > 0) {
      task.title = title;
    }
    if (description.length > 0) {
      task.description = description;
    }

    if (prereq.indexOf(id) !== -1) {
      throw new Error('Task can\'t have itself as prerequisite');
    }
    if (await this.arePrerequisitesValid(prereq)) {
      task.prerequisites = prereq;
    }
    await task.save();
    return task
  }

  @Invokable()
  public async assign(
    @Param(yup.string())
    taskId: string,
    @Param(yup.string())
    assigneeId: string
  ) {
    const task = await this.getTask(taskId);

    /* Task is assigned when caller of a function is an assignee
    * or task creator calls function and assigns a specific participant */
    if (await this.participantIsCaller(assigneeId) !== true &&
      await this.participantIsCaller(task.creator) !== true) {
      throw new Error(`Task can't be assigned to this participant.`)
    }

    if (task.state !== TaskState.MODIFIABLE) {
      throw new Error(`Can't assign task that is not in MODIFIABLE state.`)
    }

    task.assignee = assigneeId;
    task.state = TaskState.IN_PROGRESS
    await task.save();
  }

  @Invokable()
  public async passToReview(
    @Param(yup.string())
    taskId: string
  ) {
    const task = await this.getTask(taskId);
    if (await this.participantIsCaller(task.assignee) !== true) {
      throw new Error(`Only assignee can pass a task to a review.`);
    }
    if (task.state !== TaskState.IN_PROGRESS) {
      throw new Error(`Can't pass a task to review. Task is not IN_PROGRESS.`);
    }
    task.state = TaskState.IN_REVISION;
    await task.save();
  }

  @Invokable()
  public async approve(
    @Param(yup.string())
    taskId: string
  ) {
    const task = await this.getTask(taskId);
    if (await this.participantIsCaller(task.creator) !== true) {
      throw new Error(`Only creator can review a task.`);
    }
    if (task.state !== TaskState.IN_REVISION) {
      throw new Error(`Can't end revison of a task. Task is not IN_REVISION state.`);
    }
    task.state = TaskState.COMPLETED;
    await task.save();
  }

  private async getTask(id: string) {
    const task = await Task.getOne(id);
    if (!task || !task.id) {
      throw new Error(`Task with id: "${id}" doesn't exist.`);
    }
    return task;
  }

  

  private async participantIsCaller(participantId: string) {
    const participant = await Participant.getOne(participantId);
    if (!participant || !participant.id || !participant.identities) {
      throw new Error(`Participant with id: "${participantId}" doesn't exist.`);
    }
    const activeIdentity = participant.identities.filter(identity => identity.status === true)[0];
    if (activeIdentity.fingerprint === this.sender) {
      return true;
    }
    return false;
  }

  private async arePrerequisitesValid(prerequisties: string[]) {
    if (prerequisties.length === 0) {
      return true;
    }
    const tasks = await Task.getAll();
    prerequisties.forEach(function (id) {
      let task = tasks.find(function (task) {
        return task.id === id;
      });
      if (typeof task === 'undefined') {
        throw new Error(`Task with id: ${id} does not exists so it can't be set as prerequisite.`);
      }
    });
    return true;
  }
}
