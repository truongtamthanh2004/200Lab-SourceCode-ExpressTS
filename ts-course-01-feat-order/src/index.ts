import 'module-alias/register';

import { setupBrandHexagon } from '@modules/brand';
import { setupCategoryHexagon } from '@modules/category';
import { setupOrderHexagon } from '@modules/order';
import { setupProductHexagon } from '@modules/product';
import { config } from '@share/component/config';
import { sequelize } from '@share/component/sequelize';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { setupCartHexagon } from './modules/cart';
import { setupUserHexagon } from './modules/user';
import { responseErr } from './share/app-error';
import { Requester, UserRole } from './share/interface';
import { setupMiddlewares } from './share/middleware';
import { authMiddleware } from './share/middleware/auth';
import { allowRoles } from './share/middleware/check-role';
import { TokenIntrospectRPCClient } from './share/repository/verify-token.rpc';

(async () => {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');

  const app = express();
  const port = config.port;

  app.use(express.json());
  app.use(morgan('dev'));

  const myMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('myMiddleware: ', req.url);
    next();
  }

  app.use(myMiddleware); // use middleware globally

  const introspector = new TokenIntrospectRPCClient(config.rpc.verifyToken);
  const authMdl = authMiddleware(introspector);

  app.get('/v1/protected', authMdl, allowRoles([UserRole.ADMIN]), (req: Request, res: Response) => {
    const requester = res.locals.requester as Requester;
    res.status(200).json({data: requester});
  });

  // use middleware for specific route
  app.get('/', (req: Request, res: Response) => {
    // try {
    //   throw new Error('Error');
    // } catch (error) {
    //   responseErr(error as Error, res);
    //   return;
    // }

    res.send('Hello 200Lab!');
  });

  const sctx = { mdlFactory: setupMiddlewares(introspector) };

  app.use('/v1', setupCategoryHexagon(sequelize, sctx));
  app.use('/v1', setupBrandHexagon(sequelize, sctx));
  app.use('/v1', setupProductHexagon(sequelize, sctx));
  app.use('/v1', setupUserHexagon(sequelize, sctx));
  app.use('/v1', setupCartHexagon(sequelize, sctx));
  app.use('/v1', setupOrderHexagon(sequelize, sctx));

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    responseErr(err, res);
    return next();
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
