import express from "express";
import { deleteVideo, edit, upload, see } from "../controllers/videoController";
import routes from "../routers";

const videoRouter = express.Router();

videoRouter.get(routes.watch, see);
videoRouter.get(routes.editVideo, edit);
videoRouter.get(routes.deleteVideo, deleteVideo);
videoRouter.get(routes.upload, upload);

export default videoRouter;
