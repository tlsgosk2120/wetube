import express from "express";
import {
  deleteVideo,
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  watch,
} from "../controllers/videoController";
import routes from "../routers";

const videoRouter = express.Router();

videoRouter.get(routes.watch, watch);
videoRouter.route(routes.editVideo).get(getEdit).post(postEdit);
videoRouter.route(routes.upload).get(getUpload).post(postUpload);
videoRouter.route(routes.deleteVideo).get(deleteVideo);

export default videoRouter;
