import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  countLike,
  pushHeart,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post(
  "/videos/:id([0-9a-f]{24})/view",
  protectorMiddleware,
  registerView
);
apiRouter.post(
  "/videos/:id([0-9a-f]{24})/comment",
  protectorMiddleware,
  createComment
);
apiRouter.delete(
  "/comments/:id([0-9a-f]{24})/delete",
  protectorMiddleware,
  deleteComment
);
apiRouter.put(
  "/commnets/:id([0-9a-f]{24})/like",
  protectorMiddleware,
  countLike
);
apiRouter.put(
  "/commnets/:id([0-9a-f]{24})/heart",
  protectorMiddleware,
  pushHeart
);

export default apiRouter;
