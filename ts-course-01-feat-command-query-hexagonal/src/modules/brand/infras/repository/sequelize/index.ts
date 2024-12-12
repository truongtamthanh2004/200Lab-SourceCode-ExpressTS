import { Sequelize } from "sequelize";
import { BaseRepositorySequelize } from "../../../../../share/repository/repo-sequelize";
import { Brand } from "../../../model/brand";
import { BrandCondDTO, BrandUpdateDTO } from "../../../model/dto";
import { modelName } from "./dto";

export class MySQLBrandRespository extends BaseRepositorySequelize<Brand, BrandCondDTO, BrandUpdateDTO> {
  constructor(sequelize: Sequelize) {
    super(sequelize, modelName);
  }
}
