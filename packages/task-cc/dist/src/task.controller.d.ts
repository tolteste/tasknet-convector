import { ConvectorController } from '@worldsibu/convector-core-controller';
import { Task, Priority } from './task.model';
export declare class TaskController extends ConvectorController {
    create(id: string, title: string, description: string, priority: Priority, due: Date, ownerId: string, prereq: string[], attachements: string[]): Promise<void>;
    modify(id: string, title: string, description: string, priority: Priority, due: Date, prereq: string[], attachements: string[]): Promise<void>;
    assign(taskId: string, assigneeId: string): Promise<void>;
    saveDeliverables(taskId: string, deliverables: string[]): Promise<void>;
    passToReview(taskId: string): Promise<void>;
    approve(taskId: string): Promise<void>;
    revoke(taskId: string): Promise<void>;
    rework(taskId: string): Promise<void>;
    transferOwnership(taskId: string, newOwner: string): Promise<void>;
    delete(taskId: string): Promise<void>;
    get(id: string): Promise<Task>;
    getOwned(ownerId: string): Promise<Task[]>;
    getAssignedTo(assignee: string): Promise<Task[]>;
    getParticipantsTasks(participant: string): Promise<Task[]>;
    private getTask;
    private participantIsCaller;
    private arePrerequisitesValid;
}
