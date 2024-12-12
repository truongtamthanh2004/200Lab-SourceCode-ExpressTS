import { Requester } from "@share/interface";
import { PagingDTO } from "@share/model/paging";
import { CartItem, Order, OrderCondDTO, OrderCreateDTO, OrderUpdateDTO, Product } from "../model";

// Driving Ports (Use Cases)
export interface IOrderUseCase {
  makeOrder(requester: Requester, data: OrderCreateDTO): Promise<string>;
  updateOrder(requester: Requester, id: string, data: OrderUpdateDTO): Promise<boolean>;
  deleteOrder(requester: Requester, id: string, isHard: boolean): Promise<boolean>;
}

// Driven Ports (Repository)
export interface IOrderQueryRepository {
  get(id: string): Promise<Order | null>;
  list(cond: OrderCondDTO, pagination: PagingDTO): Promise<Array<Order>>;
}

export interface IOrderCommandRepository {
  insert(data: Order): Promise<void>;
  update(id: string, data: OrderUpdateDTO): Promise<boolean>;
  delete(id: string, isHard: boolean): Promise<boolean>;
}

export interface IOrderRepository extends IOrderQueryRepository, IOrderCommandRepository { }

// Driven Ports (RPC Service)
export interface ICartQueryRepository {
  listItems(userId: string): Promise<Array<CartItem>>;
  clearItems(userId: string): Promise<void>;
}

export interface IProductQueryRepository {
  findByIds(ids: Array<string>): Promise<Array<Product>>;
}