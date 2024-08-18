class VideoComponent {
  constructor(title, id) {
    this.title = title;
    this.id = id;
    this.rating = 0;
    this.views = 0;
    this.comments = 0;
    this.createdAt = "";
  }
}
let videos = [
  new VideoComponent("First Video", 0),
  new VideoComponent("Second Video", 1),
];

videos[0].rating = 5;
videos[0].views = 10;
videos[0].comments = 50;
videos[0].createdAt = "5 minutes ago";
videos[1].rating = 3.5;
videos[1].views = 1;
videos[1].comments = 10;
videos[1].createdAt = "1 hour ago";

export const trending = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  video.views += 1;
  res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};

export const search = (req, res) => {
  return res.send("search video");
};

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};

export const deleteVideo = (req, res) => {
  console.log(req.params);
  return res.send("Delete video");
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  console.log(req.params);
  console.log(req.body);
  video.title = req.body.title;
  return res.redirect(`/videos/${id}`);
};

export const postUpload = (req, res) => {
  const newVideo = new VideoComponent(req.body.title, videos.length);
  videos.push(newVideo);
  return res.redirect("/");
};
