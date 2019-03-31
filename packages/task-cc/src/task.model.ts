import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export enum TaskState {
  MODIFIABLE,
  IN_PROGRESS,
  IN_REVISION,
  COMPLETED,
  CANCELED
}

export class Task extends ConvectorModel<Task> {
  @ReadOnly()
  @Required()
  public readonly type = 'edu.taskmanager.task';

  @Required()
  @Validate(yup.string().trim())
  public title: string;

  @Required()
  @Validate(yup.string().trim())
  public description: string;

  @Required()
  @Validate(yup.number())
  public state: TaskState;

  @ReadOnly()
  @Required()
  @Validate(yup.date())
  public created: number;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public creator: string;

  @Validate(yup.string())
  public assignee: string;

  @Validate(yup.array().of(yup.string()))
  public prerequisites: string[];
}