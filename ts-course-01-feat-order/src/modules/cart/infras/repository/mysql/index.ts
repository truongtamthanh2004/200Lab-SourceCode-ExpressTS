import { ICartCommandRepository, ICartQueryRepository } from "@modules/cart/interface";
import { CartItem, CartItemCondDTO, UpdateCartItemDTO } from "@modules/cart/model";
import { Sequelize } from "sequelize";

export class CartRepository implements ICartQueryRepository, ICartCommandRepository {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) { }

  async get(id: string): Promise<CartItem | null> {
    const item = await this.sequelize.models[this.modelName].findByPk(id);

    if (!item) return null;

    const persistenceData = item.get({ plain: true });
    const { created_at, updated_at, ...props } = persistenceData;

    return { ...props, createdAt: persistenceData.created_at, updatedAt: persistenceData.updated_at } as CartItem;
  }

  async listItems(userId: string): Promise<Array<CartItem>> {
    const items = await this.sequelize.models[this.modelName].findAll({ where: { userId } });

    return items.map((row) => {
      const persistenceData = row.get({ plain: true });
      const { created_at, updated_at, ...props } = persistenceData;

      return {
        ...props,
        createdAt: persistenceData.created_at,
        updatedAt: persistenceData.updated_at,
      } as CartItem;
    });
  }

  async findByCond(cond: CartItemCondDTO): Promise<CartItem | null> {
    const item = await this.sequelize.models[this.modelName].findOne({ where: cond });

    if (!item) return null;

    const persistenceData = item.get({ plain: true });
    const { created_at, updated_at, ...props } = persistenceData;

    return { ...props, createdAt: persistenceData.created_at, updatedAt: persistenceData.updated_at } as CartItem;
  }

  async insert(data: CartItem): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data);

    return true;
  }

  async update(id: string, data: CartItem): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data, { where: { id } });

    return true;
  }

  async updateMany(dtos: UpdateCartItemDTO[], userId: string): Promise<boolean> {
    await this.sequelize.transaction(async t => {
      for (let i = 0; i < dtos.length; i++) {
        const { productId, attribute, quantity } = dtos[i];
        await this.sequelize.models[this.modelName].update(
          { quantity },
          { where: { productId, userId, attribute }, transaction: t }
        );
      }

      return true;
    });

    return true;
  }

  async remove(id: string, isHard: boolean): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });

    return true;
  }
}
