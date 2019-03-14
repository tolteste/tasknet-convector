// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import 'mocha';

import { TaskManager } from '../src/taskManager.model';
import { TaskManagerControllerClient } from '../client';

describe('TaskManager', () => {
    let modelSample: TaskManager;
    let adapter: MockControllerAdapter;
    let taskManagerCtrl: TaskManagerControllerClient;

    before(async () => {
        const now = new Date().getTime();
        modelSample = new TaskManager();
        modelSample.id = uuid();
        modelSample.name = 'Test';
        modelSample.created = now;
        modelSample.modified = now;
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

    it('should create a default model', async () => {
    await taskManagerCtrl.create(modelSample);

    const justSavedModel = await adapter.getById<TaskManager>(modelSample.id);

    expect(justSavedModel.id).to.exist;
    });
});