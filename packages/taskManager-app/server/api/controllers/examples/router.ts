import express from 'express';
import controller from './controller'
export default express.Router()

    .get('/participant/participants/:id', controller.participant_get)
    .post('/participant/register', controller.participant_register)
    .post('/participant/changeIdentity', controller.participant_changeIdentity)

    .post('/task/tasks/', controller.task_create)
    .post('/task/modify', controller.task_modify)
    .post('/task/assign', controller.task_assign)
    .post('/task/passToReview', controller.task_passToReview)
    .post('/task/approve', controller.task_approve)
    .post('/task/revoke', controller.task_revoke)
    .post('/task/rework', controller.task_rework)
    .post('/task/delete', controller.task_delete)

;
