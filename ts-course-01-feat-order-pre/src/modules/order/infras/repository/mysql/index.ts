import { DataTypes, Model, Sequelize } from "sequelize";

export class OrderPersistence extends Model { }
export class OrderItemPersistence extends Model { }

export const modelName = 'Order';

export function init(sequelize: Sequelize) {
  OrderPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.STRING,
        field: 'user_id'
      },
      shippingAddress: {
        type: DataTypes.STRING,
        field: 'shipping_address'
      },
      shippingCity: {
        type: DataTypes.STRING,
        field: 'shipping_city'
      },
      recipientFirstName: {
        type: DataTypes.STRING,
        field: 'recipient_first_name'
      },
      recipientLastName: {
        type: DataTypes.STRING,
        field: 'recipient_last_name'
      },
      recipientPhone: {
        type: DataTypes.STRING,
        field: 'recipient_phone'
      },
      recipientEmail: {
        type: DataTypes.STRING,
        field: 'recipient_email'
      },
      shippingMethod: {
        type: DataTypes.ENUM('free', 'standard'),
        field: 'shipping_method'
      },
      paymentMethod: {
        type: DataTypes.ENUM('cod', 'zalo'),
        field: 'payment_method'
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        field: 'payment_status'
      },
      trackingNumber: {
        type: DataTypes.STRING,
        field: 'tracking_number'
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed', 'canceled', 'refunded', 'deleted'),
      }
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: 'orders'
    }
  );

  OrderItemPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.STRING,
        field: 'order_id'
      },
      productId: {
        type: DataTypes.STRING,
        field: 'product_id'
      },
      name: {
        type: DataTypes.STRING,
      },
      attribute: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      price: {
        type: DataTypes.NUMBER,
      },
      quantity: {
        type: DataTypes.NUMBER,
      }
    },
    {
      sequelize,
      modelName: 'OrderItem',
      timestamps: true,
      createdAt: false,
      updatedAt: false,
      tableName: 'order_items'
    }
  );

  OrderPersistence.hasMany(OrderItemPersistence, { foreignKey: { field: 'order_id' }, as: 'items' });
}