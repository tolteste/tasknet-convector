import { ConvectorModel } from '@worldsibu/convector-core-model';
export declare enum TaskState {
    MODIFIABLE = 0,
    IN_PROGRESS = 1,
    IN_REVISION = 2,
    COMPLETED = 3,
    CANCELED = 4
}
export declare enum Priority {
    HIGH = 0,
    MEDIUM = 1,
    LOW = 2
}
export declare class Task extends ConvectorModel<Task> {
    readonly type = "edu.taskmanager.task";
    title: string;
    description: string;
    state: TaskState;
    created: number;
    owner: string;
    assignee: string;
    prerequisites: string[];
    due: Date;
    attachments: string[];
    deliverables: string[];
    priority: Priority;
}
