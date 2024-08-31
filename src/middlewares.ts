import { RequestHandler } from "express";

export const localMiddleware: RequestHandler = (req, res, next) => {
  const session = req.session as any;
  res.locals.loggedIn = Boolean(session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = session.user || {};
  console.log(res.locals);
  next();
};
