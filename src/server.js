import "core-js";
import express from "express";
import morgan from "morgan";
// import bodyParser from "body-parser"; // bodyParser 모듈이 express 모듈에 내장되기 때문에 별도로 설치하지 않아도 된다
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(express.json());

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
