import { RequestHandler } from "express";
import { Video, VideoDocument } from "../models/Video";

export const home: RequestHandler = async (req, res) => {
  const videos = await Video.find({});
  res.render("home", { pageTitle: "Home", videos });
};

export const watch: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const video: VideoDocument = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }

  res.render("watch", { pageTitle: video.title, video });
};

export const getEdit: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const video: VideoDocument = await Video.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }

  res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags }: VideoDocument = req.body;

  if (!Video.exists({ _id: id })) {
    return res.render("404", { pageTitle: "Video not found" });
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const search: RequestHandler = (req, res) => {
  return res.send("search video");
};

export const getUpload: RequestHandler = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};

export const deleteVideo: RequestHandler = (req, res) => {
  console.log(req.params);
  return res.send("Delete video");
};

export const postUpload: RequestHandler = async (req, res) => {
  const { title, description, hashtags }: VideoDocument = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
