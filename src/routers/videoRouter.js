import express from "express";
import {
  deleteVideo,
  getEdit,
  postEdit,
  upload,
  watch,
} from "../controllers/videoController";
import routes from "../routers";

const videoRouter = express.Router();

videoRouter.get(routes.watch, watch);
videoRouter.route(routes.editVideo).get(getEdit).post(postEdit);
// videoRouter.get(routes.deleteVideo, deleteVideo);
// videoRouter.get(routes.upload, upload);

export default videoRouter;
