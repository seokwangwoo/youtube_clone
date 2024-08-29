import express from "express";

import {
  watch,
  getEdit,
  deleteVideo,
  getUpload,
  postEdit,
  postUpload,
} from "../controllers/videos";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-z]{24})", watch);
videoRouter.route("/:id([0-9a-z]{24})/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-z]{24})/delete", deleteVideo);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
