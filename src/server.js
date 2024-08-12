import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("Not allowed");
  }
  console.log("Allowed");
  next();
};

const controller = (req, res) => {
  return res.end();
};

const handleProtected = (req, res) => {
  return res.send("protected");
};

app.use(logger, privateMiddleware);
app.get("/", controller);
app.get("/protected", handleProtected);

app.get("/login", (req, res) => {
  return res.send("login");
});

function handleListening() {
  console.log(`Listening on : ${PORT}`);
}

app.listen(4000, handleListening);
