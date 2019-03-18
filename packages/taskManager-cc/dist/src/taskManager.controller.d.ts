import { ConvectorController } from '@worldsibu/convector-core-controller';
export declare class TaskManagerController extends ConvectorController {
    create(title: string, description: string, prereq?: string[]): Promise<any>;
    modify(id: string, title: string, description: string, prereq?: string[]): Promise<string>;
    private arePrerequisitesValid(prerequisties);
}
