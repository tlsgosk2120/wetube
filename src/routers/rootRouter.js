import express from "express";
import { getJoin, postJoin, login } from "../controllers/userController";
import { search, home } from "../controllers/videoController";
import routes from "../routers";

const rootRouter = express.Router();

rootRouter.get(routes.home, home);
rootRouter.route(routes.join).get(getJoin).post(postJoin);
rootRouter.get(routes.login, login);
rootRouter.get(routes.search, search);

export default rootRouter;
