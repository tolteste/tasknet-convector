import { ConvectorController } from '@worldsibu/convector-core-controller';
import { Task } from './task.model';
export declare class TaskController extends ConvectorController {
    create(task: Task): Promise<void>;
    modify(id: string, title: string, description: string, prereq: string[]): Promise<void>;
    assign(taskId: string, assigneeId: string): Promise<void>;
    passToReview(taskId: string): Promise<void>;
    approve(taskId: string): Promise<void>;
    revoke(taskId: string): Promise<void>;
    rework(taskId: string): Promise<void>;
    delete(taskId: string): Promise<void>;
    private getTask(id);
    private participantIsCaller(participantId);
    private arePrerequisitesValid(prerequisties);
}
