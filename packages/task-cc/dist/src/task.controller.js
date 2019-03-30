"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var convector_core_controller_1 = require("@worldsibu/convector-core-controller");
var convector_rest_api_decorators_1 = require("@worldsibu/convector-rest-api-decorators");
var task_model_1 = require("./task.model");
var participant_cc_1 = require("participant-cc");
var TaskController = (function (_super) {
    tslib_1.__extends(TaskController, _super);
    function TaskController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TaskController.prototype.create = function (task) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var exists;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, !this.participantIsCaller(task.creator)];
                    case 1:
                        if (_a.sent()) {
                            throw new Error("Participant with creatorId: " + task.creator + " does not have identity of a current caller.");
                        }
                        return [4, task_model_1.Task.getOne(task.id)];
                    case 2:
                        exists = _a.sent();
                        while (exists.id === task.id) {
                            throw new Error('Task with that id already exists.');
                        }
                        if (typeof task.prerequisites === 'undefined') {
                            task.prerequisites = [];
                        }
                        return [4, this.arePrerequisitesValid(task.prerequisites)];
                    case 3:
                        _a.sent();
                        task.state = task_model_1.TaskState.MODIFIABLE;
                        task.created = Date.now();
                        task.assignee = undefined;
                        return [4, task.save()];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TaskController.prototype.modify = function (id, title, description, prereq) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var task;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getTask(id)];
                    case 1:
                        task = _a.sent();
                        return [4, this.participantIsCaller(task.creator)];
                    case 2:
                        if ((_a.sent()) !== true) {
                            throw new Error('Only creator of the task is able to make modifications.');
                        }
                        if (task.state !== task_model_1.TaskState.MODIFIABLE) {
                            throw new Error("Can't modify a task that is not in MODIFIABLE state.");
                        }
                        if (title.length > 0) {
                            task.title = title;
                        }
                        if (description.length > 0) {
                            task.description = description;
                        }
                        if (prereq.indexOf(id) !== -1) {
                            throw new Error('Task can\'t have itself as prerequisite');
                        }
                        return [4, this.arePrerequisitesValid(prereq)];
                    case 3:
                        if (_a.sent()) {
                            task.prerequisites = prereq;
                        }
                        return [4, task.save()];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TaskController.prototype.assign = function (taskId, assigneeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var task, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.getTask(taskId)];
                    case 1:
                        task = _b.sent();
                        return [4, this.participantIsCaller(assigneeId)];
                    case 2:
                        _a = (_b.sent()) !== true;
                        if (!_a) return [3, 4];
                        return [4, this.participantIsCaller(task.creator)];
                    case 3:
                        _a = (_b.sent()) !== true;
                        _b.label = 4;
                    case 4:
                        if (_a) {
                            throw new Error("Task can't be assigned to this participant.");
                        }
                        if (task.state !== task_model_1.TaskState.MODIFIABLE) {
                            throw new Error("Can't assign task that is not in MODIFIABLE state.");
                        }
                        task.assignee = assigneeId;
                        task.state = task_model_1.TaskState.IN_PROGRESS;
                        return [4, task.save()];
                    case 5:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    TaskController.prototype.passToReview = function (taskId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var task;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getTask(taskId)];
                    case 1:
                        task = _a.sent();
                        return [4, this.participantIsCaller(task.assignee)];
                    case 2:
                        if ((_a.sent()) !== true) {
                            throw new Error("Only assignee can pass a task to a review.");
                        }
                        if (task.state !== task_model_1.TaskState.IN_PROGRESS) {
                            throw new Error("Can't pass a task to review. Task is not IN_PROGRESS.");
                        }
                        task.state = task_model_1.TaskState.IN_REVISION;
                        return [4, task.save()];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TaskController.prototype.approve = function (taskId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var task;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getTask(taskId)];
                    case 1:
                        task = _a.sent();
                        return [4, this.participantIsCaller(task.creator)];
                    case 2:
                        if ((_a.sent()) !== true) {
                            throw new Error("Only creator can review a task.");
                        }
                        if (task.state !== task_model_1.TaskState.IN_REVISION) {
                            throw new Error("Can't end revison of a task. Task is not IN_REVISION state.");
                        }
                        task.state = task_model_1.TaskState.COMPLETED;
                        return [4, task.save()];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TaskController.prototype.revoke = function (taskId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var task, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.getTask(taskId)];
                    case 1:
                        task = _b.sent();
                        return [4, this.participantIsCaller(task.assignee)];
                    case 2:
                        _a = (_b.sent()) !== true;
                        if (!_a) return [3, 4];
                        return [4, this.participantIsCaller(task.creator)];
                    case 3:
                        _a = (_b.sent()) !== true;
                        _b.label = 4;
                    case 4:
                        if (_a) {
                            throw new Error("Only assignee or creator can revoke a task.");
                        }
                        if (task.state !== task_model_1.TaskState.IN_PROGRESS) {
                            throw new Error("Can't revoke a task. Task is not IN_PROGRESS state.");
                        }
                        task.state = task_model_1.TaskState.MODIFIABLE;
                        task.assignee = undefined;
                        return [4, task.save()];
                    case 5:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    TaskController.prototype.rework = function (taskId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var task;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getTask(taskId)];
                    case 1:
                        task = _a.sent();
                        return [4, this.participantIsCaller(task.creator)];
                    case 2:
                        if ((_a.sent()) !== true) {
                            throw new Error("Only creator can demand a rework of a task.");
                        }
                        if (task.state !== task_model_1.TaskState.IN_REVISION) {
                            throw new Error("Can't demand rework of a task. Task is not IN_REVISION state.");
                        }
                        task.state = task_model_1.TaskState.IN_PROGRESS;
                        return [4, task.save()];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TaskController.prototype.delete = function (taskId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var task;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getTask(taskId)];
                    case 1:
                        task = _a.sent();
                        return [4, this.participantIsCaller(task.creator)];
                    case 2:
                        if ((_a.sent()) !== true) {
                            throw new Error("Only creator can delete a task.");
                        }
                        if (task.state !== task_model_1.TaskState.MODIFIABLE) {
                            throw new Error("Can't delete a task that is not MODIFIABLE.");
                        }
                        return [4, task.delete()];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    TaskController.prototype.getTask = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var task;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, task_model_1.Task.getOne(id)];
                    case 1:
                        task = _a.sent();
                        if (!task || !task.id) {
                            throw new Error("Task with id: \"" + id + "\" doesn't exist.");
                        }
                        return [2, task];
                }
            });
        });
    };
    TaskController.prototype.participantIsCaller = function (participantId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var participant, activeIdentity;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, participant_cc_1.Participant.getOne(participantId)];
                    case 1:
                        participant = _a.sent();
                        if (!participant || !participant.id || !participant.identities) {
                            throw new Error("Participant with id: \"" + participantId + "\" doesn't exist.");
                        }
                        activeIdentity = participant.identities.filter(function (identity) { return identity.status === true; })[0];
                        if (activeIdentity.fingerprint === this.sender) {
                            return [2, true];
                        }
                        return [2, false];
                }
            });
        });
    };
    TaskController.prototype.arePrerequisitesValid = function (prerequisties) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tasks;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (prerequisties.length === 0) {
                            return [2, true];
                        }
                        return [4, task_model_1.Task.getAll()];
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
        convector_rest_api_decorators_1.Create('Task'),
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(task_model_1.Task))
    ], TaskController.prototype, "create", null);
    tslib_1.__decorate([
        convector_rest_api_decorators_1.Service(),
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string())),
        tslib_1.__param(1, convector_core_controller_1.Param(yup.string().trim())),
        tslib_1.__param(2, convector_core_controller_1.Param(yup.string().trim())),
        tslib_1.__param(3, convector_core_controller_1.Param(yup.array()))
    ], TaskController.prototype, "modify", null);
    tslib_1.__decorate([
        convector_rest_api_decorators_1.Service(),
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string())),
        tslib_1.__param(1, convector_core_controller_1.Param(yup.string()))
    ], TaskController.prototype, "assign", null);
    tslib_1.__decorate([
        convector_rest_api_decorators_1.Service(),
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string()))
    ], TaskController.prototype, "passToReview", null);
    tslib_1.__decorate([
        convector_rest_api_decorators_1.Service(),
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string()))
    ], TaskController.prototype, "approve", null);
    tslib_1.__decorate([
        convector_rest_api_decorators_1.Service(),
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string()))
    ], TaskController.prototype, "revoke", null);
    tslib_1.__decorate([
        convector_rest_api_decorators_1.Service(),
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string()))
    ], TaskController.prototype, "rework", null);
    tslib_1.__decorate([
        convector_rest_api_decorators_1.Service(),
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string()))
    ], TaskController.prototype, "delete", null);
    TaskController = tslib_1.__decorate([
        convector_core_controller_1.Controller('taskManager')
    ], TaskController);
    return TaskController;
}(convector_core_controller_1.ConvectorController));
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map