import { ConvectorController } from '@worldsibu/convector-core-controller';
import { TaskManager } from './taskManager.model';
export declare class TaskManagerController extends ConvectorController {
    create(taskManager: TaskManager): Promise<void>;
}
