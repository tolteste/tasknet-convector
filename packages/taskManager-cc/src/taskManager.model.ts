import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class Task extends ConvectorModel<Task> {
  @ReadOnly()
  @Required()
  public readonly type = 'edu.taskmanager.task';

  @Required()
  @Validate(yup.string())
  public title: string;

  @Required()
  @Validate(yup.string())
  public description: string;

  @Required()
  @Validate(yup.TaskState())
  public state: TaskState;

  @ReadOnly()
  @Required()
  @Validate(yup.date())
  public created: number;

  @ReadOnly()
  @Required()
  public creator: string;
}

export enum TaskState {
  MODIFIABLE,
  IN_PROGRESS,
  IN_REVISION,
  COMPLETED,
  CANCELED
}

export class User extends ConvectorModel<User> {
  @ReadOnly()
  @Required()
  public readonly type = 'edu.taskmanger.user';

  @Required()
  @Validate(yup.string())
  public name: string;

  @Required()
  @Validate(yup.string())
  public surname: string;
}
