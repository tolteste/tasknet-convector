import { ConvectorModel } from '@worldsibu/convector-core-model';
export declare class TaskManager extends ConvectorModel<TaskManager> {
    readonly type: string;
    name: string;
    created: number;
    modified: number;
}
