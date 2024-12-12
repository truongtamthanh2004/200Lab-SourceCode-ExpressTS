import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

export const config = {
  port,
  rpc: {
    productBrand: process.env.RPC_PRODUCT_BRAND_URL || `http://localhost:${port}`,
    productCategory: process.env.RPC_PRODUCT_CATEGORY_URL || `http://localhost:${port}`,
    product: process.env.RPC_PRODUCT_URL || `http://localhost:${port}`,
    cart: process.env.RPC_CART_URL || `http://localhost:${port}`,
    verifyToken: process.env.VERIFY_TOKEN_URL || `http://localhost:${port}/v1/rpc/introspect`,
  },
  mysql: {
    database: process.env.DB_NAME || "",
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "",
    port: parseInt(process.env.DB_PORT as string),
    dialect: "mysql",
    pool: {
      max: 20,
      min: 2,
      acquire: 30000,
      idle: 60000,
    },
    logging: true,
  },
  accessToken: {
    secretKey: process.env.JWT_SECRET_KEY || '200L@b.io',
    expiresIn: '7d',
  }
}
