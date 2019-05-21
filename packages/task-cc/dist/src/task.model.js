"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var convector_core_model_1 = require("@worldsibu/convector-core-model");
var TaskState;
(function (TaskState) {
    TaskState[TaskState["MODIFIABLE"] = 0] = "MODIFIABLE";
    TaskState[TaskState["IN_PROGRESS"] = 1] = "IN_PROGRESS";
    TaskState[TaskState["IN_REVISION"] = 2] = "IN_REVISION";
    TaskState[TaskState["COMPLETED"] = 3] = "COMPLETED";
    TaskState[TaskState["CANCELED"] = 4] = "CANCELED";
})(TaskState = exports.TaskState || (exports.TaskState = {}));
var Priority;
(function (Priority) {
    Priority[Priority["HIGH"] = 0] = "HIGH";
    Priority[Priority["MEDIUM"] = 1] = "MEDIUM";
    Priority[Priority["LOW"] = 2] = "LOW";
})(Priority = exports.Priority || (exports.Priority = {}));
var Task = (function (_super) {
    tslib_1.__extends(Task, _super);
    function Task() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'edu.taskmanager.task';
        return _this;
    }
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required()
    ], Task.prototype, "type", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string().trim())
    ], Task.prototype, "title", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string().trim())
    ], Task.prototype, "description", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.number())
    ], Task.prototype, "state", void 0);
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.date())
    ], Task.prototype, "created", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string())
    ], Task.prototype, "owner", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Validate(yup.string())
    ], Task.prototype, "assignee", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Validate(yup.array().of(yup.string()))
    ], Task.prototype, "prerequisites", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.date())
    ], Task.prototype, "due", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Validate(yup.array().of(yup.string()))
    ], Task.prototype, "attachments", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Validate(yup.array().of(yup.string()))
    ], Task.prototype, "deliverables", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Validate(yup.number())
    ], Task.prototype, "priority", void 0);
    return Task;
}(convector_core_model_1.ConvectorModel));
exports.Task = Task;
//# sourceMappingURL=task.model.js.map