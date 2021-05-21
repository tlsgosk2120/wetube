import express from "express";
import {
  deleteVideo,
  editVideo,
  upload,
  videoDetail,
} from "../controller/videoController";
import routes from "../routers";

const videoRouter = express.Router();

videoRouter.get(routes.upload, upload);
videoRouter.get(routes.editVideo, editVideo);
videoRouter.get(routes.deleteVideo, deleteVideo);
videoRouter.get(routes.videoDetail, videoDetail);

export default videoRouter;
