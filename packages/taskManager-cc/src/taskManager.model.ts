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
  public readonly type = 'io.worldsibu.task';

  @Required()
  @Validate(yup.string())
  public title: string;

  @Required()
  @Validate(yup.string())
  public description: string;

  @Required()
  public state: TaskState;

  @ReadOnly()
  @Required()
  @Validate(yup.date())
  public created: Date;

  @ReadOnly()
  @Required()
  public creator: User;
}

enum TaskState {
  MODIFIABLE,
  IN_PROGRESS,
  IN_REVISION,
  COMPLETED,
  CANCELED
}

export class User extends ConvectorModel<User> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.user';

  @Required()
  @Validate(yup.string())
  public name: string;

  @Required()
  @Validate(yup.string())
  public surname: string;

  @Required()
  public email: string;

}
