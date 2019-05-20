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

export enum Priority {
  HIGH,
  MEDIUM,
  LOW
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
  public owner: string;

  @Validate(yup.string())
  public assignee: string;

  @Validate(yup.array().of(yup.string()))
  public prerequisites: string[];

  @Required()
  @Validate(yup.string().matches(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/, { excludeEmptyString: true }))
  public due: Date;

  @Validate(yup.array().of(yup.string()))
  public attachments: string[];

  @Validate(yup.number())
  public priority: Priority;
}
