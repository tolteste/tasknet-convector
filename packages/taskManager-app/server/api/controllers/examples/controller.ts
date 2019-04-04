import { Request, Response } from 'express';
import { ParticipantControllerClient } from '../../../smartContractControllers';
import { TaskControllerClient } from '../../../smartContractControllers';
import { Models } from '../../../smartContractModels';

export class Controller {





  async task_create(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let modelRaw = req.body;
      let model = new Models.Task(modelRaw);
      let result = await cntrl.create(model);
      res.json(result);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }

  async task_modify(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.modify(params.id,params.title,params.description,params.prereq);
      if (returnObject === undefined) {
        return res.status(404);
      }
      res.json(returnObject);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }

  async task_assign(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.assign(params.taskId,params.assigneeId);
      if (returnObject === undefined) {
        return res.status(404);
      }
      res.json(returnObject);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }

  async task_passToReview(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.passToReview(params.taskId);
      if (returnObject === undefined) {
        return res.status(404);
      }
      res.json(returnObject);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }

  async task_approve(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.approve(params.taskId);
      if (returnObject === undefined) {
        return res.status(404);
      }
      res.json(returnObject);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }

  async task_revoke(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.revoke(params.taskId);
      if (returnObject === undefined) {
        return res.status(404);
      }
      res.json(returnObject);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }

  async task_rework(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.rework(params.taskId);
      if (returnObject === undefined) {
        return res.status(404);
      }
      res.json(returnObject);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }

  async task_delete(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.delete(params.taskId);
      if (returnObject === undefined) {
        return res.status(404);
      }
      res.json(returnObject);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }


}
export default new Controller();
