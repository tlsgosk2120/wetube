import express from "express";
import {
  deleteVideo,
  edit,
  upload,
  watch,
} from "../controllers/videoController";
import routes from "../routers";

const videoRouter = express.Router();

videoRouter.get(routes.watch, watch);
videoRouter.get(routes.editVideo, edit);
videoRouter.get(routes.deleteVideo, deleteVideo);
videoRouter.get(routes.upload, upload);

export default videoRouter;
