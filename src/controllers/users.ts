import { RequestHandler } from "express";
import { User, UserDocument } from "../models/User";
import bcrypt from "bcrypt";

export const getJoin: RequestHandler = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin: RequestHandler = async (req, res) => {
  const { name, email, username, password, password2, location }: UserDocument =
    req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match.",
    });
  }

  const usernameExists = await User.exists({ username, socialOnly: false });
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

export const getEdit: RequestHandler = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit: RequestHandler = async (req, res) => {
  const { name, location }: UserDocument = req.body;
  const session = req.session as any;
  const updateUser = await User.findByIdAndUpdate(
    session.user._id,
    {
      name,
      location,
      avatarUrl: `/${req.file?.path}`,
    },
    { new: true },
  );
  session.user = updateUser;
  return res.redirect("/users/edit");
};

export const remove: RequestHandler = (req, res) => {
  return res.send("remove user");
};

export const logout: RequestHandler = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });
  return res.redirect("/");
};

export const userProfile: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  console.log(user);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }

  return res.render("users/profile", { pageTitle: "Profile", user });
};

export const startGithubLogin: RequestHandler = (req, res) => {
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: "false",
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const baseUrl = "https://github.com/login/oauth/authorize";
  return res.redirect(`${baseUrl}?${params}`);
};

export const finishGithubLogin: RequestHandler = async (req, res) => {
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code as string,
  };
  const params = new URLSearchParams(config).toString();
  const baseUrl = "https://github.com/login/oauth/access_token";
  const finalUrl = `${baseUrl}?${params}`;

  const token = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  const json = (await token.json()) as any;

  if ("access_token" in json) {
    const { access_token } = json;
    const apiUrl = "https://api.github.com";
    const userData = await fetch(`${apiUrl}/user`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const userDataJson = (await userData.json()) as any;

    const emailData = await fetch(`${apiUrl}/user/emails`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const emailDataJson = (await emailData.json()) as Array<object>;
    const emailObj = emailDataJson.find(
      (email: any) => email.primary === true && email.verified === true,
    ) as any;

    if (!emailObj) {
      return res.status(400).render("login", {
        pageTitle: "Login",
        errorMessage: "No verified email found.",
      });
    }

    let user = await User.findOne({ email: emailObj.email });
    const session = req.session as any;
    if (!user) {
      user = await User.create({
        name: userDataJson.name == null ? "Dummy" : userDataJson.name,
        avatarUrl: userDataJson.avatar_url,
        email: emailObj.email,
        username: userDataJson.login,
        password: "",
        socialOnly: true,
        location: userDataJson.location,
      });
    }

    session.loggedIn = true;
    session.user = user;

    return res.redirect("/");
  } else {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Error in Github Authorization.",
    });
  }
};

export const getChangePassword: RequestHandler = (req, res) => {
  const session = req.session as any;
  if (session.user.socialOnly === true) {
    return res.redirect("/users/edit");
  }

  return res.render("users/change-password", {
    pageTitle: "Change Password",
  });
};

export const postChangePassword: RequestHandler = async (req, res) => {
  const { oldPassword, newPassword, newPassword2 } = req.body;
  const session = req.session as any;
  const user = await User.findById(session.user._id);

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect.",
    });
  }

  if (newPassword !== newPassword2) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation.",
    });
  }

  user.password = newPassword;
  session.user = await user.save();

  return res.redirect("/users/logout");
};
