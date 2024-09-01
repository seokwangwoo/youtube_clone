import "dotenv/config";
import "./db";
import "./models/Video";
import app from "./server";

app.listen(process.env.PORT);
