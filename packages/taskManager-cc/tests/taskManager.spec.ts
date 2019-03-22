// tslint:disable:no-unused-expression
import { join } from 'path';
import * as chai from 'chai'
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import 'mocha';
import * as chaiAsPromised from 'chai-as-promised';
import { Task, TaskState } from '../src/taskManager.model';
import { ClientFactory } from '@worldsibu/convector-core';
import { print } from 'util';
import { ParticipantController } from '../../participant-cc/src';
import { TaskManagerController } from '../src';
import { Participant } from '../../participant-cc/src';
import { TaskManagerControllerClient } from '../client';

describe('TaskManager', () => {
  chai.use(chaiAsPromised);
  let idCreatedTask = null;
  let idCreatedTask2 = null;
  let adapter: MockControllerAdapter;
  let taskManagerCtrl: TaskManagerControllerClient;
  let participantCtrl: ParticipantController;

  before(async () => {
    adapter = new MockControllerAdapter();
    taskManagerCtrl = new TaskManagerControllerClient(adapter);
    await adapter.init([
      {
        version: '*',
        controller: 'TaskManagerController',
        name: join(__dirname, '..')
      },
      {
        version: '*',
        controller: 'ParticipantController',
        name: join(__dirname, '../../participant-cc')
      }
    ]);
    //taskManagerCtrl = ClientFactory(TaskManagerController, adapter);
    participantCtrl = ClientFactory(ParticipantController, adapter);
    await participantCtrl.register('Participant1');
    let p1 = await adapter.getById<Participant>('Participant1');
  });

  it('should create a task', async () => {
    idCreatedTask = await taskManagerCtrl.create('Test title   ', 'Test description   ', 'Participant1');
    const retrivedTask = await adapter.getById<Task>(idCreatedTask);
    expect(retrivedTask.id).to.exist;
    expect(retrivedTask.title).to.equal("Test title");
    expect(retrivedTask.description).to.equal("Test description");
    expect(retrivedTask.prerequisites).to.be.empty;
  });

  it('should modify a task with trimmed title and description', async () => {
    await taskManagerCtrl.modify(idCreatedTask, "Foo title   ", "  Foo description");
    const retrivedTask = await adapter.getById<Task>(idCreatedTask);
    expect(retrivedTask.title).to.equal("Foo title");
    expect(retrivedTask.description).to.equal("Foo description");
    expect(retrivedTask.prerequisites).to.be.empty
  });

  it('should create a task with prerequisite', async () => {
    idCreatedTask2 = await taskManagerCtrl.create('Test title 2', 'Test description 2', 'Participant1', [idCreatedTask]);
    const retrivedTask = await adapter.getById<Task>(idCreatedTask2);
    expect(retrivedTask.id).to.exist;
    expect(retrivedTask.prerequisites).to.contain(idCreatedTask);
  });

  it('should modify a task with prerequisite', async () => {
    await taskManagerCtrl.modify(idCreatedTask, "", "", [idCreatedTask2]);
    const retrivedTask = await adapter.getById<Task>(idCreatedTask);
    expect(retrivedTask.title).to.equal("Foo title");
    expect(retrivedTask.description).to.equal("Foo description");
    expect(retrivedTask.prerequisites).to.contain(idCreatedTask2);
  });

  it('should throw an error when assigning itself as prerequisite', async () => {
    await chai.expect(taskManagerCtrl.modify(idCreatedTask, "", "", [idCreatedTask]))
      .to.eventually.be.rejectedWith('Task can\'t have itself as prerequisite');
  });

  it('should throw an error when user that did not created the task wants to make a modification', async () => {
    (adapter.stub as any).usercert = '-----BEGIN CERTIFICATE-----' +
      'MIICjzCCAjWgAwIBAgIUITsRsw5SIJ+33SKwM4j1Dl4cDXQwCgYIKoZIzj0EAwIw' +
      'czELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh' +
      'biBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMT' +
      'E2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMTgwODEzMDEyOTAwWhcNMTkwODEzMDEz' +
      'NDAwWjBCMTAwDQYDVQQLEwZjbGllbnQwCwYDVQQLEwRvcmcxMBIGA1UECxMLZGVw' +
      'YXJ0bWVudDExDjAMBgNVBAMTBXVzZXIzMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcD' +
      'QgAEcrfc0HHq5LG1UbyPSRLNjIQKqYoNY7/zPFC3UTJi3TTaIEqgVL6DF/8JIKuj' +
      'IT/lwkuemafacXj8pdPw3Zyqs6OB1zCB1DAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0T' +
      'AQH/BAIwADAdBgNVHQ4EFgQUHFUlW/XJC7VcJe5pLFkz+xlMNpowKwYDVR0jBCQw' +
      'IoAgQ3hSDt2ktmSXZrQ6AY0EK2UHhXMx8Yq6O7XiA+X6vS4waAYIKgMEBQYHCAEE' +
      'XHsiYXR0cnMiOnsiaGYuQWZmaWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQxIiwi' +
      'aGYuRW5yb2xsbWVudElEIjoidXNlcjMiLCJoZi5UeXBlIjoiY2xpZW50In19MAoG' +
      'CCqGSM49BAMCA0gAMEUCIQCNsmDjOXF/NvciSZebfk2hfSr/v5CqRD7pIHCq3lIR' +
      'lwIgPC/qGM1yeVinfN0z7M68l8rWn4M4CVR2DtKMpk3G9k9=' +
      '-----END CERTIFICATE-----';
    await participantCtrl.register('Participant2');
    await chai.expect(taskManagerCtrl.modify(idCreatedTask, "Test", "", []))
      .to.eventually.be.rejectedWith('Only creator of the task is able to make modifications.');
  });

  it('should assign a participant as an assignee to a task', async () => {
    let idTask = await taskManagerCtrl.create("Test","Description","Participant2");
    await taskManagerCtrl.assign(idTask,'Participant1');
    let retrivedTask = await adapter.getById<Task>(idTask);
    chai.expect(retrivedTask.assignee).to.equal('Participant1');
    chai.expect(retrivedTask.creator).to.equal('Participant2');
    chai.expect(retrivedTask.state).to.equal(TaskState.IN_PROGRESS);
  });

  it('should throw an error when caller is not creator and trying to assign different participant', async () => {
    await chai.expect(taskManagerCtrl.assign(idCreatedTask2,'Participant1')).to.eventually.be.rejectedWith('Task can\'t be assigned to this participant.');
  });

  it('should assign a participant as an assignee to a task created by Participant1', async() => {
    await taskManagerCtrl.assign(idCreatedTask,'Participant2');
    let retrivedTask = await adapter.getById<Task>(idCreatedTask);
    chai.expect(retrivedTask.assignee).to.equal('Participant2');
    chai.expect(retrivedTask.creator).to.equal('Participant1');
    chai.expect(retrivedTask.state).to.equal(TaskState.IN_PROGRESS);
  });
});