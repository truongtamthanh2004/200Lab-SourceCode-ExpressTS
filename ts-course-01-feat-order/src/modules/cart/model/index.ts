import { z } from 'zod';
import { ErrQuantityMustBePositive } from './error';

// duplicate of product model (don't import directly from product module)
// It just only contains fields that are used in cart module
export const cartProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(z.string()).nullable(),
  salePrice: z.number(),
  price: z.number(),
  quantity: z.number(),
});

// cart item model
export const cartItemSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(''),
  quantity: z.number().min(1, ErrQuantityMustBePositive.message).default(1),
  product: cartProductSchema.optional(),
});

// DTOs
export const addCartItemDTOSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(''),
  quantity: z.number().min(1).default(1),
});

export const cartItemCondDTOSchema = z.object({
  userId: z.string().optional(),
  productId: z.string().optional(),
  attribute: z.string().nullable().optional().default(''),
});

export const updateCartItemDTOSchema = z.object({
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(''),
  quantity: z.number().int(),
});

export type CartProduct = z.infer<typeof cartProductSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

export type AddCartItemDTO = z.infer<typeof addCartItemDTOSchema>;
export type CartItemCondDTO = z.infer<typeof cartItemCondDTOSchema>;
export type UpdateCartItemDTO = z.infer<typeof updateCartItemDTOSchema>;
