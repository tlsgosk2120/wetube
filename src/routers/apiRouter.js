import express from "express";
import {
  registerView,
  createComment,
  editComment,
  deleteComment,
  countVideoLike,
  countCommentLike,
  pushHeart,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post(
  "/videos/:id([0-9a-f]{24})/view",
  protectorMiddleware,
  registerView
);
apiRouter.put(
  "/videos/:id([0-9a-f]{24})/like",
  protectorMiddleware,
  countVideoLike
);
apiRouter.post(
  "/videos/:id([0-9a-f]{24})/comment",
  protectorMiddleware,
  createComment
);
apiRouter.put(
  "/comments/:id([0-9a-f]{24})/edit",
  protectorMiddleware,
  editComment
);
apiRouter.delete(
  "/comments/:id([0-9a-f]{24})/delete",
  protectorMiddleware,
  deleteComment
);
apiRouter.put(
  "/commnets/:id([0-9a-f]{24})/like",
  protectorMiddleware,
  countCommentLike
);
apiRouter.put(
  "/commnets/:id([0-9a-f]{24})/heart",
  protectorMiddleware,
  pushHeart
);

export default apiRouter;
