import { ConvectorModel } from '@worldsibu/convector-core-model';
export declare enum TaskState {
    MODIFIABLE = 0,
    IN_PROGRESS = 1,
    IN_REVISION = 2,
    COMPLETED = 3,
    CANCELED = 4,
}
export declare class Task extends ConvectorModel<Task> {
    readonly type: string;
    title: string;
    description: string;
    state: TaskState;
    created: number;
    creator: string;
    assignee: string;
    prerequisites: string[];
}
