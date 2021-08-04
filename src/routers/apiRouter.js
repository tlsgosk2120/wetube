import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  countLike,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})/delete", deleteComment);
apiRouter.put("/commnets/:id([0-9a-f]{24})/like", countLike);

export default apiRouter;
