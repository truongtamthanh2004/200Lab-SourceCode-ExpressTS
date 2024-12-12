import { UserRole } from "@share/interface";
import { ServiceContext } from "@share/interface/service-context";
import { Router } from "express";
import { Sequelize } from "sequelize";
import { init, modelName } from "./infras/repository/dto";
import { MySQLCategoryRepository } from "./infras/repository/repo";
import { CategoryHttpService } from "./infras/transport/http-service";
import { CategoryUseCase } from "./usecase";

export const setupCategoryHexagon = (sequelize: Sequelize, sctx: ServiceContext) => {
  init(sequelize);

  const repository = new MySQLCategoryRepository(sequelize, modelName);
  const useCase = new CategoryUseCase(repository);
  const httpService = new CategoryHttpService(useCase);

  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN]);

  router.post('/categories', mdlFactory.auth, adminChecker, httpService.createAPI.bind(httpService));
  router.get('/categories/:id', httpService.getDetailAPI.bind(httpService));
  router.get('/categories', httpService.listAPI.bind(httpService));
  router.patch('/categories/:id', mdlFactory.auth, adminChecker, httpService.updateAPI.bind(httpService));
  router.delete('/categories/:id', mdlFactory.auth, adminChecker, httpService.deleteAPI.bind(httpService));

  return router;
};
