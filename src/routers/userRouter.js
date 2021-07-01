import express from "express";
import {
  // changePassword,
  getEdit,
  postEdit,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
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
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get(routes.see, see);
// userRouter.get(routes.changePassword, changePassword);

export default userRouter;
