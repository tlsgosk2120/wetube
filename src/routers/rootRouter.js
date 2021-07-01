import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";
import { search, home } from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middlewares";
import routes from "../routers";

const rootRouter = express.Router();

rootRouter.get(routes.home, home);
rootRouter
  .route(routes.join)
  .all(publicOnlyMiddleware)
  .get(getJoin)
  .post(postJoin);
rootRouter
  .route(routes.login)
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get(routes.search, search);

export default rootRouter;
