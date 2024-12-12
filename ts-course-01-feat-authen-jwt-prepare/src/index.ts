import 'module-alias/register';

import { setupBrandHexagon } from '@modules/brand';
import { setupCategoryHexagon } from '@modules/category';
import { setupProductHexagon } from '@modules/product';
import { sequelize } from '@share/component/sequelize';
import { config } from 'dotenv';
import express, { Request, Response } from 'express';

config();

(async () => {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello 200Lab!');
  });

  app.use('/v1', setupCategoryHexagon(sequelize));
  app.use('/v1', setupBrandHexagon(sequelize));
  app.use('/v1', setupProductHexagon(sequelize));

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
