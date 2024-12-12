import { z } from 'zod';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'canceled',
  REFUNDED = 'refunded',
  DELETED = 'deleted'
}

export enum PaymentMethod {
  COD = 'cod',
  ZALO = 'zalo_pay'
}

export enum ShippingMethod {
  FREE = 'free',
  STANDARD = 'standard'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed'
}

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  name: z.string(),
  attribute: z.string(),
  price: z.number(),
  quantity: z.number(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().optional(),
  recipientFirstName: z.string(),
  recipientLastName: z.string(),
  recipientPhone: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  shippingMethod: z.nativeEnum(ShippingMethod),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentStatus: z.nativeEnum(PaymentStatus),
  trackingNumber: z.string(),
  status: z.nativeEnum(OrderStatus),
  items: z.array(orderItemSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Order = z.infer<typeof orderSchema>;

export const orderCondDTOSchema = orderSchema.pick({
  userId: true,
  shippingMethod: true,
  paymentMethod: true,
  trackingNumber: true,
  paymentStatus: true,
  status: true,
}).partial();

export type OrderCondDTO = z.infer<typeof orderCondDTOSchema>;

export const orderCreateSchema = orderSchema.pick({
  userId: true,
  shippingAddress: true,
  shippingCity: true,
  recipientFirstName: true,
  recipientLastName: true,
  recipientPhone: true,
  recipientEmail: true,
  shippingMethod: true,
  paymentMethod: true,
});

export type OrderCreateDTO = z.infer<typeof orderCreateSchema>;

export const orderUpdateSchema = orderSchema.pick({
  paymentMethod: true,
  paymentStatus: true,
  status: true,
  shippingAddress: true,
  shippingCity: true,
  recipientFirstName: true,
  recipientLastName: true,
  recipientPhone: true,
  recipientEmail: true,
  shippingMethod: true,
}).partial();

export type OrderUpdateDTO = z.infer<typeof orderUpdateSchema>;


// Strongly Recommend: Duplicate models from cart
// Don't import directly!!

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

export type Product = {
  id: string;
  name: string;
  salePrice: number;
  image: string | null;
};

export type CartItem = {
  id: string;
  userId: string;
  productId: string;
  attribute: string | null;
  quantity: number;
  product: Product;
};