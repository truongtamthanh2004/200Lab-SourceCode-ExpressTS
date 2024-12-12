import { Requester } from "@share/interface";
import { generateRandomString } from "@share/util";
import { v7 } from "uuid";
import { ICartQueryRepository, IOrderCommandRepository, IOrderUseCase } from "../interface";
import { Order, OrderCreateDTO, orderCreateSchema, OrderItem, OrderStatus, OrderUpdateDTO, PaymentStatus } from "../model";

export class OrderUseCase implements IOrderUseCase {
  constructor(
    // private readonly orderQueryRepo: IOrderQueryRepository,
    private readonly orderCommandRepo: IOrderCommandRepository,
    private readonly cartQueryRepo: ICartQueryRepository,
  ) {}

  async makeOrder(requester: Requester, data: OrderCreateDTO): Promise<string> {
    const { sub: userId } = requester;
    data = orderCreateSchema.parse(data);

    const cartItems = await this.cartQueryRepo.listItems(userId);

    // TODO: Check if the product is enough
    const newId = v7();
    const trackingNumber = generateRandomString(6);

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      id: v7(),
      orderId: newId,
      productId: item.productId,
      name: item.product.name,
      attribute: item.attribute ?? '',
      price: item.product.salePrice,
      quantity: item.quantity,
    }));

    const order: Order = {
      id: newId,
      userId,
      ...data,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      trackingNumber,
      items: orderItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.orderCommandRepo.insert(order);
    return newId;
  }

  updateOrder(requester: Requester, id: string, data: OrderUpdateDTO): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteOrder(requester: Requester, id: string, isHard: boolean): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}