import { RequestHandler } from "express";
import { Video, VideoDocument } from "../models/Video";
import { User } from "../models/User";
import { SchemaTypeOptions } from "mongoose";

export const home: RequestHandler = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  res.render("home", { pageTitle: "Home", videos });
};

export const watch: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const video: VideoDocument = await (
    await Video.findById(id)
  ).populate("owner");
  console.log(video);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  res.render("watch", { pageTitle: video.title, video });
};

export const getEdit: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const session = req.session as any;
  const video: VideoDocument = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  if (String(video.owner) != String(session.user._id)) {
    return res.status(403).redirect("/");
  }

  res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const session = req.session as any;
  const { title, description, hashtags }: VideoDocument = req.body;
  const video: VideoDocument = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  if (String(video.owner) != String(session.user._id)) {
    return res.status(403).redirect("/");
  }

  await video.updateOne({
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
  const file = req.file;
  const session = req.session as any;
  const { title, description, hashtags }: VideoDocument = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: `/${file.path}`,
      hashtags: Video.formatHashtags(hashtags),
      owner: session.user._id,
    });
    const user = await User.findById(session.user._id);
    user.videos.push(newVideo._id);
    user.save();
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
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  const session = req.session as any;
  if (String(video.owner) != String(session.user._id)) {
    return res.status(403).redirect("/");
  }

  await video.deleteOne();
  return res.redirect("/");
};
