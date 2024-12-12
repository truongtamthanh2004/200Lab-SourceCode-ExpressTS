import { ProductCondDTO, ProductUpdateDTO } from "@modules/product/model/dto";
import { Product } from "@modules/product/model/product";
import { BaseCommandRepositorySequelize, BaseQueryRepositorySequelize, BaseRepositorySequelize } from "@share/repository/repo-sequelize";
import { Sequelize } from "sequelize";

export class MySQLProductRepository extends BaseRepositorySequelize<Product, ProductCondDTO, ProductUpdateDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { 
    super(
      new MYSQLProductQueryRepository(sequelize, modelName),
      new MYSQLProductCommandRepository(sequelize, modelName),
    );
  }
}

export class MYSQLProductQueryRepository extends BaseQueryRepositorySequelize<Product, ProductCondDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { 
    super(sequelize, modelName);
  }
}

export class MYSQLProductCommandRepository extends BaseCommandRepositorySequelize<Product, ProductUpdateDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { 
    super(sequelize, modelName);
  }
} 