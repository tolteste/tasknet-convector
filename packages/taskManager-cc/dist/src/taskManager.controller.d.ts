import { ConvectorController } from '@worldsibu/convector-core-controller';
import { Task } from './taskManager.model';
export declare class TaskManagerController extends ConvectorController {
    create(title: string, description: string, creatorId: string, prereq?: string[]): Promise<any>;
    modify(id: string, title: string, description: string, prereq?: string[]): Promise<Task>;
    assign(taskId: string, assigneeId: string): Promise<void>;
    private getTask(id);
    private participantIsCaller(participantId);
    private arePrerequisitesValid(prerequisties);
}
