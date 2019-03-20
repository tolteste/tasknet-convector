import * as yup from 'yup';
import * as uuid from 'uuid/v4'

import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { Task, TaskState } from '../src/taskManager.model';
import { Participant } from 'participant-cc';
import { stringify } from 'querystring';
import { print } from 'util';
import { ControllerAdapter } from '@worldsibu/convector-core-adapter';


export class TaskManagerControllerClient extends ConvectorController {
  public name = 'taskManager';

  constructor(public adapter: ControllerAdapter, public user?: string) {
    super()
  }

  /**
   * @param title Shortly describes a specified task
   * @param description Provides more detailed description of a task
   * @param creatorId Participant.id that will be set as creator
   * @param prereq Array<string> with ids of all prerequisite tasks
   * @returns id of created task
   */public async create(
    
    title: string,
    
    description: string,
    
    creatorId: string,
    
    prereq: string[] = []
  ) {

           return await this.adapter.invoke(this.name, 'create', this.user, title, description, creatorId, prereq);
         
   }

  
  public async modify(
    
    id: string,
    
    title: string,
    
    description: string,
    
    prereq: string[] = []
  ) {

          return await this.adapter.invoke(this.name, 'modify', this.user, id, title, description, prereq);
        
  }

  
  public async assign(
    
    taskId: string,
    
    assigneeId: string
  ) {

          return await this.adapter.invoke(this.name, 'assign', this.user, taskId, assigneeId);
        
  }
}
