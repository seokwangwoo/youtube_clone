import express from "express";
import { edit } from "../controllers/users";

const userRouter = express.Router();

userRouter.get("/edit", edit);

export default userRouter;
