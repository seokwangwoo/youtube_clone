import express from "express";
import { home, search } from "../controllers/videos";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/users";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
