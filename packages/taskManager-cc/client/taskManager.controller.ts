import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { TaskManager } from '../src/taskManager.model';
import { ControllerAdapter } from '@worldsibu/convector-core-adapter';


export class TaskManagerControllerClient extends ConvectorController {
  public name = 'taskManager';

  constructor(public adapter: ControllerAdapter, public user?: string) {
    super()
  }

  
  public async create(
    
    taskManager: TaskManager
  ) {

          return await this.adapter.invoke(this.name, 'create', this.user, taskManager);
        
  }
}