import { IOrderUseCase } from "@modules/order/interface";
import { Requester } from "@share/interface";
import { ServiceContext } from "@share/interface/service-context";
import { Request, Response, Router } from "express";

export class OrderHttpService {
  constructor(private readonly orderUseCase: IOrderUseCase) {}

  async makeOrderAPI(req: Request, res: Response) {
    const { body } = req;
    const requester = res.locals.requester as Requester;

    const result = await this.orderUseCase.makeOrder(requester, body);

    res.status(200).json({data: result});
  }

  getRoute(sctx: ServiceContext): Router {
    const router = Router();

    router.post('/orders', sctx.mdlFactory.auth, this.makeOrderAPI.bind(this));

    return router;
  }
}
