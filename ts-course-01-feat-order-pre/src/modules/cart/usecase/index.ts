import { AppError, ErrForbidden } from "@share/app-error";
import { v7 } from "uuid";
import { ICartCommandRepository, ICartQueryRepository, ICartUseCase, IProductQueryRepository } from "../interface";
import { AddCartItemDTO, addCartItemDTOSchema, CartItem } from "../model";
import { ErrCartItemNotFound, ErrProductNotEnoughQuantity, ErrProductNotFound } from "../model/error";

export class CartUseCase implements ICartUseCase {
  constructor(
    private readonly cartQueryRepo: ICartQueryRepository,
    private readonly cartCommandRepo: ICartCommandRepository,
    private readonly productQueryRepo: IProductQueryRepository,
  ) { }

  async addProductToCart(dto: AddCartItemDTO): Promise<boolean> {
    const dataDTO = addCartItemDTOSchema.parse(dto);
    const { userId, productId, attribute, quantity } = dataDTO;

    // 1. Get Product (CartProduct model, with quantity)

    const product = await this.productQueryRepo.findById(productId);

    if (!product) {
      throw AppError.from(ErrProductNotFound, 400);
    }

    // 2. Check if the product is already in the cart
    const existingItem = await this.cartQueryRepo.findByCond({ userId, productId, attribute });

    if (existingItem) {
      // check product quantity if enough (after add more quantity)
      const newQuantity = existingItem.quantity + quantity;
      if (product.quantity < newQuantity) throw AppError.from(ErrProductNotEnoughQuantity, 400);
      
      // add more quantity
      await this.cartCommandRepo.update(existingItem.id, { ...existingItem, quantity: newQuantity});
    } else {
      // check product quantity if enough
      if (product.quantity < quantity) throw AppError.from(ErrProductNotEnoughQuantity, 400);
      // add product item to cart
      const newId = v7();
      const newItem = { ...dataDTO, id: newId, createdAt: new Date(), updatedAt: new Date() };
      await this.cartCommandRepo.insert(newItem);
    }

    return true;
  }

  async removeProductFromCart(id: string, requesterId: string): Promise<boolean> {
    const existingItem = await this.cartQueryRepo.get(id);

    if (!existingItem) {
      throw AppError.from(ErrCartItemNotFound, 400);
    }

    if (existingItem.userId !== requesterId) {
      throw ErrForbidden.withLog('This item does not belong to this user');
    }

    await this.cartCommandRepo.remove(id, true);
    return true;
  }

  async listItems(requesterId: string): Promise<Array<CartItem> | null> {
    const items = await this.cartQueryRepo.listItems(requesterId);

    // 1. Get cart products by ids
    // 2. Map cart products to cart items
    
    return items;
  }
}
