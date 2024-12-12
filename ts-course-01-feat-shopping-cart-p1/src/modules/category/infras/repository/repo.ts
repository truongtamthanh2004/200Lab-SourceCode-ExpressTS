import { CategoryCondDTO, CategoryUpdateDTO } from "@modules/category/model/dto";
import { Category } from "@modules/category/model/model";
import { BaseCommandRepositorySequelize, BaseQueryRepositorySequelize, BaseRepositorySequelize } from "@share/repository/repo-sequelize";
import { Sequelize } from "sequelize";

// implement ORM here (Sequelize)

export class MySQLCategoryRepository extends BaseRepositorySequelize<Category, CategoryCondDTO, CategoryUpdateDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { 
    super(
      new MYSQLCategoryQueryRepository(sequelize, modelName),
      new MYSQLCategoryCommandRepository(sequelize, modelName),
    );
  }
}

export class MYSQLCategoryQueryRepository extends BaseQueryRepositorySequelize<Category, CategoryCondDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { 
    super(sequelize, modelName);
  }
}

export class MYSQLCategoryCommandRepository extends BaseCommandRepositorySequelize<Category, CategoryUpdateDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { 
    super(sequelize, modelName);
  }
} 
