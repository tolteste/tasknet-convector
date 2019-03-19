"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var uuid = require("uuid/v4");
var convector_core_controller_1 = require("@worldsibu/convector-core-controller");
var taskManager_model_1 = require("./taskManager.model");
var TaskManagerController = (function (_super) {
    tslib_1.__extends(TaskManagerController, _super);
    function TaskManagerController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TaskManagerController.prototype.create = function (title, description, prereq) {
        if (prereq === void 0) { prereq = []; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var id, exists, task;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = uuid();
                        return [4, taskManager_model_1.Task.getOne(id)];
                    case 1:
                        exists = _a.sent();
                        while (exists.id === id) {
                            id = uuid();
                        }
                        task = new taskManager_model_1.Task(id);
                        task.title = title;
                        task.description = description;
                        task.state = taskManager_model_1.TaskState.MODIFIABLE;
                        task.created = Date.now();
                        if (this.arePrerequisitesValid(prereq)) {
                            task.prerequisties = prereq;
                        }
                        else {
                            return [2];
                        }
                        task.creator = this.sender;
                        return [4, task.save()];
                    case 2:
                        _a.sent();
                        return [2, id];
                }
            });
        });
    };
    TaskManagerController.prototype.modify = function (id, title, description, prereq) {
        if (prereq === void 0) { prereq = []; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var task;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, taskManager_model_1.Task.getOne(id)];
                    case 1:
                        task = _a.sent();
                        if (task.creator !== this.sender) {
                            throw new Error('Only creator of the task is able to make modifications.');
                        }
                        if (title.length > 0) {
                            task.title = title.trim();
                        }
                        if (description.length > 0) {
                            task.description = description.trim();
                        }
                        if (prereq.indexOf(id) !== -1) {
                            throw new Error('Task can\'t have itself as prerequisite');
                        }
                        return [4, this.arePrerequisitesValid(prereq)];
                    case 2:
                        if (_a.sent()) {
                            task.prerequisties = prereq;
                        }
                        return [4, task.save()];
                    case 3:
                        _a.sent();
                        return [2, task];
                }
            });
        });
    };
    TaskManagerController.prototype.arePrerequisitesValid = function (prerequisties) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tasks;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (prerequisties.length === 0) {
                            return [2, true];
                        }
                        return [4, taskManager_model_1.Task.getAll()];
                    case 1:
                        tasks = _a.sent();
                        prerequisties.forEach(function (id) {
                            var task = tasks.find(function (task) {
                                return task.id === id;
                            });
                            if (typeof task === 'undefined') {
                                throw new Error("Task with id: " + id + " does not exists so it can't be set as prerequisite.");
                            }
                        });
                        return [2, true];
                }
            });
        });
    };
    tslib_1.__decorate([
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string().required().trim())),
        tslib_1.__param(1, convector_core_controller_1.Param(yup.string().required().trim())),
        tslib_1.__param(2, convector_core_controller_1.Param(yup.array().of(yup.string())))
    ], TaskManagerController.prototype, "create", null);
    tslib_1.__decorate([
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string())),
        tslib_1.__param(1, convector_core_controller_1.Param(yup.string())),
        tslib_1.__param(2, convector_core_controller_1.Param(yup.string())),
        tslib_1.__param(3, convector_core_controller_1.Param(yup.array().of(yup.string())))
    ], TaskManagerController.prototype, "modify", null);
    TaskManagerController = tslib_1.__decorate([
        convector_core_controller_1.Controller('taskManager')
    ], TaskManagerController);
    return TaskManagerController;
}(convector_core_controller_1.ConvectorController));
exports.TaskManagerController = TaskManagerController;
//# sourceMappingURL=taskManager.controller.js.map