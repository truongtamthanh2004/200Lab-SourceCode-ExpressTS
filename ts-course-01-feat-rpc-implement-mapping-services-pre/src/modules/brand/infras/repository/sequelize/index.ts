import { Brand } from "@modules/brand/model/brand";
import { BrandCondDTO, BrandUpdateDTO } from "@modules/brand/model/dto";
import { BaseCommandRepositorySequelize, BaseQueryRepositorySequelize, BaseRepositorySequelize } from "@share/repository/repo-sequelize";
import { Sequelize } from "sequelize";
import { modelName } from "./dto";

export class MySQLBrandRespository extends BaseRepositorySequelize<Brand, BrandCondDTO, BrandUpdateDTO> {
  constructor(sequelize: Sequelize) {
    super(
      new MySQLQueryRepository(sequelize, modelName),
      new MySQLCommandRepository(sequelize, modelName)
    );
  }
}

export class MySQLQueryRepository extends BaseQueryRepositorySequelize<Brand, BrandCondDTO> {}
export class MySQLCommandRepository extends BaseCommandRepositorySequelize<Brand, BrandUpdateDTO> {}
