// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import 'mocha';

import { Task, TaskState, User } from '../src/taskManager.model';
import { TaskManagerControllerClient } from '../client';
import { print } from 'util';

describe('TaskManager', () => {
  let modelSample: Task;
  let idCreatedTask = null;
  let idCreatedTask2 = null;
  let adapter: MockControllerAdapter;
  let taskManagerCtrl: TaskManagerControllerClient;

  before(async () => {
    //  const now = new Date().getTime();
    //  modelSample = new Task();
    //  modelSample.id = uuid();
    //  modelSample.title = 'Test';
    //  modelSample.description = 'Longer description'
    //  modelSample.created = now;
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    taskManagerCtrl = new TaskManagerControllerClient(adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'TaskManagerController',
        name: join(__dirname, '..')
      }
    ]);

  });

  it('should create a task', async () => {
    idCreatedTask = await taskManagerCtrl.create('Test title   ', 'Test description   ');
    const retrivedTask = await adapter.getById<Task>(idCreatedTask);
    expect(retrivedTask.id).to.exist;
    expect(retrivedTask.title).to.equal("Test title");
    expect(retrivedTask.description).to.equal("Test description");
    expect(retrivedTask.prerequisties).to.be.empty;
  });

  it('should modify a task with trimmed title and description', async () => {
    await taskManagerCtrl.modify(idCreatedTask, "Foo title   ", "  Foo description");
    const retrivedTask = await adapter.getById<Task>(idCreatedTask);
    expect(retrivedTask.title).to.equal("Foo title");
    expect(retrivedTask.description).to.equal("Foo description");
    expect(retrivedTask.prerequisties).to.be.empty
  });

  it('should create a task with prerequisite', async () => {
    idCreatedTask2 = await taskManagerCtrl.create('Test title 2', 'Test description 2',[idCreatedTask]);
    const retrivedTask = await adapter.getById<Task>(idCreatedTask2);
    expect(retrivedTask.id).to.exist;
    expect(retrivedTask.prerequisties).to.contain(idCreatedTask);
  });

  it('should modify a task with prerequisite', async () => {
    await taskManagerCtrl.modify(idCreatedTask, "", "", [idCreatedTask2]);
    const retrivedTask = await adapter.getById<Task>(idCreatedTask);
    expect(retrivedTask.title).to.equal("Foo title");
    expect(retrivedTask.description).to.equal("Foo description");
    expect(retrivedTask.prerequisties).to.contain(idCreatedTask2);
  });
});