import express from 'express';
import controller from './controller'
export default express.Router()

    .get('/participant/participants/:id', controller.participant_get)
    .post('/participant/register', controller.participant_register)
    .post('/participant/changeIdentity', controller.participant_changeIdentity)

    .get('/task/tasks/:id', controller.task_get)
    .get('/task/tasks/owned/:id', controller.task_getOwned)
    .get('/task/tasks/assigned:id', controller.task_getAssignedTo)
    .post('/task/create', controller.task_create)
    .post('/task/modify', controller.task_modify)
    .post('/task/assign', controller.task_assign)
    .post('/task/saveDeliverables', controller.task_saveDeliverables)
    .post('/task/passToReview', controller.task_passToReview)
    .post('/task/approve', controller.task_approve)
    .post('/task/revoke', controller.task_revoke)
    .post('/task/rework', controller.task_rework)
    .post('/task/transferOwnership', controller.task_transferOwnership)
    .post('/task/delete', controller.task_delete)

;
