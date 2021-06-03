import express from "express";
import { join, login } from "../controllers/userController";
import { search, trending } from "../controllers/videoController";
import routes from "../routers";

const globalRouter = express.Router();

globalRouter.get(routes.home, trending);
globalRouter.get(routes.join, join);
globalRouter.get(routes.login, login);
globalRouter.get(routes.search, search);

export default globalRouter;
