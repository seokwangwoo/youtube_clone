import { RequestHandler } from "express";
import multer from "multer";

export const localMiddleware: RequestHandler = (req, res, next) => {
  const session = req.session as any;
  res.locals.loggedIn = Boolean(session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = session.user || {};
  next();
};

export const protectorMiddleware: RequestHandler = (req, res, next) => {
  const session = req.session as any;
  if (session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware: RequestHandler = (req, res, next) => {
  const session = req.session as any;
  if (!session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const uploadAvatarMiddleware = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000,
  },
}).single("avatar");

export const uploadVideoMiddleware = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 100000000,
  },
}).single("video");
