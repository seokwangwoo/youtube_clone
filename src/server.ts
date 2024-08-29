import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/global";
import videoRouter from "./routers/videos";
import userRouter from "./routers/users";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
