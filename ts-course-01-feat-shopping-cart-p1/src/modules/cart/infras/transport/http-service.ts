import { ICartUseCase } from "@modules/cart/interface";
import { Request, Response } from "express";

export class CartHTTPService {
  constructor(
    private readonly cartUseCase: ICartUseCase
  ) { }

  async addProductToCartAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;
    const dto = { ...req.body, userId }; // very important!!!

    const result = await this.cartUseCase.addProductToCart(dto);

    res.status(200).json({ data: result });
  }

  async removeProductFromCartAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;
    const { id } = req.params;

    const result = await this.cartUseCase.removeProductFromCart(id, userId);

    res.status(200).json({ data: result });
  }

  async listItemsAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;

    const result = await this.cartUseCase.listItems(userId);

    // Optional: get cart products by ids
    // ... mapping
    
    res.status(200).json({ data: result });
  }
}
