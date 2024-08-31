import { RequestHandler } from "express";
import { Video, VideoDocument } from "../models/Video";

export const home: RequestHandler = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  res.render("home", { pageTitle: "Home", videos });
};

export const watch: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const video: VideoDocument = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  res.render("watch", { pageTitle: video.title, video });
};

export const getEdit: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const video: VideoDocument = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags }: VideoDocument = req.body;

  if (!Video.exists({ _id: id })) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const search: RequestHandler = async (req, res) => {
  const { keyword } = req.query;
  let matched = [];
  if (keyword) {
    matched = await Video.find({
      title: { $regex: new RegExp(`${keyword}`, "i") },
    });
  }
  return res.render("search", { pageTitle: "Results", videos: matched });
};

export const getUpload: RequestHandler = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
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

export const deleteVideo: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
