import { config } from "@share/component/config";
import { ServiceContext } from "@share/interface/service-context";
import { Router } from "express";
import { Sequelize } from "sequelize";
import { CartRepository } from "./infras/repository/mysql";
import { init, modelName } from "./infras/repository/mysql/dto";
import { CartProductRPCRepo } from "./infras/repository/rpc";
import { CartHTTPService } from "./infras/transport/http-service";
import { CartUseCase } from "./usecase";

export function setupCartHexagon(sequelize: Sequelize, sctx: ServiceContext): Router {
  init(sequelize);

  const cartRepository = new CartRepository(sequelize, modelName);
  const productRPCRepository = new CartProductRPCRepo(config.rpc.product);

  const cartUseCase = new CartUseCase(cartRepository, cartRepository, productRPCRepository);

  const cartHttpService = new CartHTTPService(cartUseCase);

  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  // const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN]);

  router.post('/carts', mdlFactory.auth, cartHttpService.addProductToCartAPI.bind(cartHttpService));
  router.delete('/carts/:id', mdlFactory.auth, cartHttpService.removeProductFromCartAPI.bind(cartHttpService));

  return router;
}

// Shoping cart's main features:
// 1. Add a product to cart
// 2. Remove a product from cart
// 3. Update product quantity (one or many) in cart
// 4. Clear cart
// 5. Create Order from cart (Order module)



























// Find all products with product ids
// type ReduceRS = { ids: Array<string>; mapProdIdQuantity: Record<string, number>; };
// const initValue: ReduceRS = { ids: [], mapProdIdQuantity: {} };

// const rs = cmd.dtos.reduce((accum, current, i, []): ReduceRS => {
//   return {
//     ids: [...accum.ids, current.productId],
//     mapProdIdQuantity: {
//       ...accum.mapProdIdQuantity,
//       [current.productId]: current.quantity
//     }
//   };
// }, initValue);