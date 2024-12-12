import { ICartQueryRepository, ICartUseCase, IProductQueryRepository } from "@modules/cart/interface";
import { CartItem } from "@modules/cart/model";
import { Request, Response } from "express";

export class CartHTTPService {
  constructor(
    private readonly cartUseCase: ICartUseCase,
    private readonly cartQueryRepo: ICartQueryRepository,
    private readonly productQueryRepo: IProductQueryRepository
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

  async updateProductQuantitiesAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;
    const dto = req.body;

    await this.cartUseCase.updateProductQuantities(dto, userId);

    res.status(200).json({ data: true });
  }

  async listItemsAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;

    const items = await this.cartQueryRepo.listItems(userId);

    // Get product ids
    const productIds = items.map(item => item.productId);
    
    const itemMap = new Map<string, CartItem>(); // productId -> CartItem
    items.forEach(item => itemMap.set(item.productId, item));

    const products = await this.productQueryRepo.findByIds(productIds);

    products.forEach(product => {
      const item = itemMap.get(product.id);
      if (item) item.product = product;
    });

    res.status(200).json({ data: items });
  }

  async listItemsRPC(req: Request, res: Response) {
    const { userId } = req.body;

    const items = await this.cartQueryRepo.listItems(userId);

    // Get product ids
    const productIds = items.map(item => item.productId);

    const itemMap = new Map<string, CartItem>(); // productId -> CartItem
    items.forEach(item => itemMap.set(item.productId, item));

    const products = await this.productQueryRepo.findByIds(productIds);

    products.forEach(product => {
      const item = itemMap.get(product.id);
      if (item) item.product = product;
    });

    res.status(200).json({ data: items });
  }
}
