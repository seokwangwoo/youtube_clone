import { RequestHandler } from "express";

export const join: RequestHandler = (req, res) => {
  return res.send("join");
};

export const login: RequestHandler = (req, res) => {
  return res.send("join");
};

export const edit: RequestHandler = (req, res) => {
  return res.send("edit user");
};

export const remove: RequestHandler = (req, res) => {
  return res.send("remove user");
};

export const logout: RequestHandler = (req, res) => {
  return res.send("remove user");
};

export const see: RequestHandler = (req, res) => {
  console.log(req.params);
  return res.send("Watch");
};
