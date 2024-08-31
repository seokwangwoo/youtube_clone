import { RequestHandler } from "express";
import { User, UserDocument } from "../models/User";
import bcrypt from "bcrypt";

export const getJoin: RequestHandler = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin: RequestHandler = async (req, res) => {
  const { name, email, username, password, password2, location }: UserDocument =
    req.body;
  const usernameExists = await User.exists({ username });
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match.",
    });
  }
  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This username is already taken.",
    });
  }
  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      password2,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

export const getLogin: RequestHandler = (req, res) => {
  return res.render("login", { pageTitle: "Login", req });
};

export const postLogin: RequestHandler = async (req, res) => {
  const { username, password }: UserDocument = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exists.",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong password.",
    });
  }
  const session = req.session as any;
  session.loggedIn = true;
  session.user = user;
  return res.redirect("/");
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
