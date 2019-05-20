import * as yup from 'yup';

import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';
import {
  GetById,
  GetAll,
  Create,
  Service
} from '@worldsibu/convector-rest-api-decorators';
import { Task, TaskState, Priority } from './task.model';
import { Participant } from 'participant-cc';
import { stringify } from 'querystring';
import { print } from 'util';

@Controller('Task')
export class TaskController extends ConvectorController {
  /**
   * @param id Identifier string of created task
   * @param title Shortly describes a specified task
   * @param description Provides more detailed description of a task
   * @param priority Sets an priority of a task
   * @param due deadline for completion
   * @param ownerId Participant.id that will be set as owner
   * @param prereq Array<string> with ids of all prerequisite tasks
   * @param attachements Array<string> with hashes of attachements
   * */
  @Service()
  @Invokable()
  public async create(
    @Param(yup.string().required())
    id: string,
    @Param(yup.string().required().trim())
    title: string,
    @Param(yup.string().required().trim())
    description: string,
    @Param(yup.number())
    priority: Priority,
    //validation through regexp since yup does not support date validation for Date objects
    @Param(yup.string().matches(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/, { excludeEmptyString: true }))
    due: Date,
    @Param(yup.string())
    ownerId: string,
    @Param(yup.array().of(yup.string()))
    prereq: string[],
    @Param(yup.array().of(yup.string()))
    attachements: string[]
  ) {
    if (await !this.participantIsCaller(ownerId)) {
      throw new Error(`Participant with ownerId: ${ownerId} does not have identity of a current caller.`)
    }
    // Checking for colisions
    var exists = await Task.getOne(id)
    if (exists && exists.id) {
      // Colision found
      throw new Error('Task with that id already exists.')
    }

    let task = new Task(id);
    // Task initialization
    if (typeof prereq === 'undefined') {
      task.prerequisites = [];
    }
    if (await this.arePrerequisitesValid) {
      task.prerequisites = prereq;
    }
    if (typeof attachements === 'undefined') {
      task.attachments = [];
    } else {
      task.attachments = attachements;
    }
    task.title = title;
    task.description = description;
    task.state = TaskState.MODIFIABLE;
    task.priority = priority;
    task.due = due;
    task.created = Date.now();
    task.assignee = undefined;
    task.owner = ownerId;
    await task.save();
  }

  @Service()
  @Invokable()
  public async modify(
    @Param(yup.string())
    id: string,
    @Param(yup.string().trim())
    title: string,
    @Param(yup.string().trim())
    description: string,
    @Param(yup.array())
    prereq: string[]
  ) {
    const task = await this.getTask(id);

    if (await this.participantIsCaller(task.owner) !== true) {
      throw new Error('Only owner of the task is able to make modifications.');
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
  }

  @Service()
  @Invokable()
  public async assign(
    @Param(yup.string())
    taskId: string,
    @Param(yup.string())
    assigneeId: string
  ) {
    const task = await this.getTask(taskId);

    /* Task is assigned when caller of a function is an assignee
    * or task owner calls function and assigns a specific participant */
    if (await this.participantIsCaller(assigneeId) !== true &&
      await this.participantIsCaller(task.owner) !== true) {
      throw new Error(`Task can't be assigned to this participant.`)
    }

    if (task.state !== TaskState.MODIFIABLE) {
      throw new Error(`Can't assign task that is not in MODIFIABLE state.`)
    }

    task.assignee = assigneeId;
    task.state = TaskState.IN_PROGRESS
    await task.save();
  }

  @Service()
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

  @Service()
  @Invokable()
  public async approve(
    @Param(yup.string())
    taskId: string
  ) {
    const task = await this.getTask(taskId);
    if (await this.participantIsCaller(task.owner) !== true) {
      throw new Error(`Only owner can review a task.`);
    }
    if (task.state !== TaskState.IN_REVISION) {
      throw new Error(`Can't end revison of a task. Task is not IN_REVISION state.`);
    }
    task.state = TaskState.COMPLETED;
    await task.save();
  }

  @Service()
  @Invokable()
  public async revoke(
    @Param(yup.string())
    taskId: string
  ) {
    const task = await this.getTask(taskId);
    if (await this.participantIsCaller(task.assignee) !== true &&
      await this.participantIsCaller(task.owner) !== true) {
      throw new Error(`Only assignee or owner can revoke a task.`);
    }
    if (task.state !== TaskState.IN_PROGRESS) {
      throw new Error(`Can't revoke a task. Task is not IN_PROGRESS state.`);
    }
    task.state = TaskState.MODIFIABLE;
    task.assignee = undefined;
    await task.save();
  }

  @Service()
  @Invokable()
  public async rework(
    @Param(yup.string())
    taskId: string
  ) {
    const task = await this.getTask(taskId);
    if (await this.participantIsCaller(task.owner) !== true) {
      throw new Error(`Only owner can demand a rework of a task.`);
    }
    if (task.state !== TaskState.IN_REVISION) {
      throw new Error(`Can't demand rework of a task. Task is not IN_REVISION state.`);
    }
    task.state = TaskState.IN_PROGRESS;
    await task.save();
  }

  @Service()
  @Invokable()
  public async delete(
    @Param(yup.string())
    taskId: string
  ) {
    const task = await this.getTask(taskId);
    if (await this.participantIsCaller(task.owner) !== true) {
      throw new Error(`Only owner can delete a task.`);
    }
    if (task.state !== TaskState.MODIFIABLE) {
      throw new Error(`Can't delete a task that is not MODIFIABLE.`)
    }
    await task.delete()
  }

  @GetById('Task')
  @Invokable()
  public async get(
    @Param(yup.string())
    id: string
  ) {
    const existing = await Task.getOne(id);
    if (!existing || !existing.id) {
      throw new Error(`No task exists with that ID ${id}`);
    }
    return existing;
  }

  //========================================================================
  //=======================SUPPORT FUNCTIONS================================
  //========================================================================

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
