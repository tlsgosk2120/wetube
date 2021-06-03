import express from "express";
import {
  // changePassword,
  edit,
  remove,
  see,
  logout,
} from "../controllers/userController";
import routes from "../routers";

const userRouter = express.Router();

userRouter.get(routes.logout, logout);
userRouter.get(routes.editProfile, edit);
userRouter.get(routes.removeProfile, remove);
userRouter.get(routes.see, see);
// userRouter.get(routes.changePassword, changePassword);

export default userRouter;
