import { ConvectorController } from '@worldsibu/convector-core-controller';
import { Task } from './taskManager.model';
export declare class TaskManagerController extends ConvectorController {
    create(title: string, description: string, prereq?: string[]): Promise<any>;
    modify(id: string, title: string, description: string, prereq?: string[]): Promise<Task>;
    private arePrerequisitesValid(prerequisties);
}
