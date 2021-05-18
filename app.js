import "core-js";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser"; // bodyParser 모듈이 express 모듈에 내장되기 때문에 별도로 설치하지 않아도 된다
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routers from "./routers";

const app = express();

app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.unsubscribe(helmet());
app.use(morgan("dev"));

app.use(routers.home, globalRouter);
app.use(routers.users, userRouter);
app.use(routers.videos, videoRouter);

export default app;
