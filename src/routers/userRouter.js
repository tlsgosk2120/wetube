import express from "express";
import {
  // changePassword,
  edit,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
import routes from "../routers";

const userRouter = express.Router();

userRouter.get(routes.logout, logout);
userRouter.get(routes.editProfile, edit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get(routes.see, see);
// userRouter.get(routes.changePassword, changePassword);

export default userRouter;
