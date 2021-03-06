import { Request, Response } from 'express';
import { ParticipantControllerClient } from '../../../smartContractControllers';
import { TaskControllerClient } from '../../../smartContractControllers';
import { Models } from '../../../smartContractModels';

export class Controller {


  async participant_get(req: Request, res: Response) {
    let cntrl = await ParticipantControllerClient.init();
    let result = await cntrl.get(req.params.id);
    if (!result) {
      return res.status(404);
    }
    res.json(result);
  }

  async participant_register(req: Request, res: Response) {
    try {
      let cntrl = await ParticipantControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.register(params.id);
      if (returnObject === undefined) {
        return res.status(404);
      }
      res.json(returnObject);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }

  async participant_changeIdentity(req: Request, res: Response) {
    try {
      let cntrl = await ParticipantControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.changeIdentity(params.id,params.newIdentity);
      if (returnObject === undefined) {
        return res.status(404);
      }
      res.json(returnObject);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }




  async task_get(req: Request, res: Response) {
    let cntrl = await TaskControllerClient.init();
    let result = await cntrl.get(req.params.id);
    if (!result) {
      return res.status(404);
    }
    res.json(result);
  }

  async task_getOwned(req: Request, res: Response) {
    let cntrl = await TaskControllerClient.init();
    let result = await cntrl.getOwned(req.params.id);
    if (!result) {
      return res.status(404);
    }
    res.json(result);
  }

  async task_getAssignedTo(req: Request, res: Response) {
    let cntrl = await TaskControllerClient.init();
    let result = await cntrl.getAssignedTo(req.params.id);
    if (!result) {
      return res.status(404);
    }
    res.json(result);
  }

  async task_getAll(req: Request, res: Response) {
    let cntrl = await TaskControllerClient.init();
    let result = await cntrl.getAll();
    if (!result) {
      return res.status(404);
    }
    res.json(result);
  }

  async task_getUnassigned(req: Request, res: Response) {
    let cntrl = await TaskControllerClient.init();
    let result = await cntrl.getUnassigned();
    if (!result) {
      return res.status(404);
    }
    res.json(result);
  }

  async task_create(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.create(params.id,params.title,params.description,params.priority,params.due,params.ownerId,params.prereq,params.attachments);
      if (returnObject === undefined) {
        return res.status(404);
      }
      res.json(returnObject);
    } catch (ex) {
      console.log(ex.message, ex.stack);
      res.status(500).send(ex.stack);
    }
  }

  async task_modify(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.modify(params.id,params.title,params.description,params.priority,params.due,params.prereq,params.attachements);
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

  async task_saveDeliverables(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.saveDeliverables(params.taskId,params.deliverables);
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

  async task_transferOwnership(req: Request, res: Response) {
    try {
      let cntrl = await TaskControllerClient.init();
      let params = req.body;
      
      let returnObject = await cntrl.transferOwnership(params.taskId,params.newOwner);
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
