import express from "express";
import {
  deleteVideo,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  watch,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";
import routes from "../routers";

const videoRouter = express.Router();

videoRouter.get(routes.watch, watch);
videoRouter
  .route(routes.editVideo)
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route(routes.upload)
  .all(protectorMiddleware)
  .get(getUpload)
  .post(postUpload);
videoRouter.route(routes.deleteVideo).all(protectorMiddleware).get(deleteVideo);

export default videoRouter;
