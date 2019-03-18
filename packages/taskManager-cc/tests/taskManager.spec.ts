// tslint:disable:no-unused-expression
import { join } from 'path';
import * as chai from 'chai'
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import 'mocha';
import * as chaiAsPromised from 'chai-as-promised';
import { Task, TaskState, User } from '../src/taskManager.model';
import { TaskManagerControllerClient } from '../client';
import { print } from 'util';

describe('TaskManager', () => {
  chai.use(chaiAsPromised);
  let idCreatedTask = null;
  let idCreatedTask2 = null;
  let adapter: MockControllerAdapter;
  let taskManagerCtrl: TaskManagerControllerClient;

  before(async () => {
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
    idCreatedTask2 = await taskManagerCtrl.create('Test title 2', 'Test description 2', [idCreatedTask]);
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

  it('should throw an error when assigning itself as prerequisite', async () => {
    await chai.expect(taskManagerCtrl.modify(idCreatedTask, "", "", [idCreatedTask]))
      .to.eventually.be.rejectedWith('Task can\'t have itself as prerequisite');
  });
});