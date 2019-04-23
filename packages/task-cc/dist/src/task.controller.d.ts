import { ConvectorController } from '@worldsibu/convector-core-controller';
import { Task } from './task.model';
export declare class TaskController extends ConvectorController {
    create(id: string, title: string, description: string, creatorId: string, prereq: string[]): Promise<void>;
    modify(id: string, title: string, description: string, prereq: string[]): Promise<void>;
    assign(taskId: string, assigneeId: string): Promise<void>;
    passToReview(taskId: string): Promise<void>;
    approve(taskId: string): Promise<void>;
    revoke(taskId: string): Promise<void>;
    rework(taskId: string): Promise<void>;
    delete(taskId: string): Promise<void>;
    get(id: string): Promise<Task>;
    private getTask;
    private participantIsCaller;
    private arePrerequisitesValid;
}
