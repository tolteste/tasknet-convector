import { BaseStorage } from '@worldsibu/convector-core-storage';
import { CouchDBStorage } from '@worldsibu/convector-storage-couchdb';

import { Participant as ParticipantModel } from 'participant-cc/dist/src';
import { Task as TaskModel } from 'task-cc/dist/src';

export namespace Models {
  export const Participant = ParticipantModel;
  export const Task = TaskModel;
}
