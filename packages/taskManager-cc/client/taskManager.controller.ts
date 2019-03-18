import * as yup from 'yup';
import * as uuid from 'uuid/v4'

import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { Task, User, TaskState } from '../src/taskManager.model';
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
   * @returns id of created task
   */public async create(
    
    title: string,
    
    description: string
  ) {

           return await this.adapter.invoke(this.name, 'create', this.user, title, description);
         
   }

  
  public async modify(
    
    id: string,
    
    title: string,
    
    description: string,
    
    prereq: string[] = ['']
  ) {

          return await this.adapter.invoke(this.name, 'modify', this.user, id, title, description, prereq);
        
  }
}
