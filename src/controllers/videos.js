export const trending = (req, res) => {
  res.render("home", { pageTitle: "Home" });
};

export const see = (req, res) => {
  res.render("watch");
};

export const edit = (req, res) => {
  console.log(req.params);
  return res.send("edit video");
};

export const search = (req, res) => {
  return res.send("search video");
};

export const upload = (req, res) => {
  console.log(req.params);
  return res.send("upload video");
};

export const deleteVideo = (req, res) => {
  console.log(req.params);
  return res.send("Delete video");
};
