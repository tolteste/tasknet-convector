"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var convector_core_controller_1 = require("@worldsibu/convector-core-controller");
var taskManager_model_1 = require("./taskManager.model");
var TaskManagerController = (function (_super) {
    tslib_1.__extends(TaskManagerController, _super);
    function TaskManagerController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TaskManagerController.prototype.create = function (taskManager) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, taskManager.save()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    tslib_1.__decorate([
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(taskManager_model_1.TaskManager))
    ], TaskManagerController.prototype, "create", null);
    TaskManagerController = tslib_1.__decorate([
        convector_core_controller_1.Controller('taskManager')
    ], TaskManagerController);
    return TaskManagerController;
}(convector_core_controller_1.ConvectorController));
exports.TaskManagerController = TaskManagerController;
//# sourceMappingURL=taskManager.controller.js.map