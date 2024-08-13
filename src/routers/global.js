import express from "express";
import { trending } from "../controllers/videos";

const globalRouter = express.Router();

globalRouter.get("/", trending);

export default globalRouter;
