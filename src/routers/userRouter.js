import express from "express";
import {
  getEdit,
  postEdit,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";
import routes from "../routers";

const userRouter = express.Router();

userRouter.get(routes.logout, protectorMiddleware, logout);
userRouter
  .route(routes.editProfile)
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
userRouter
  .route(routes.changePassword)
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get(routes.see, see);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

export default userRouter;
