import express  , {Request , Response} from "express";
import authRouter from "./routes/auth.routes";
import subcriptionRouter from "./routes/subcription.routes";
import userRouter from "./routes/user.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
import { arcjetMiddleware } from "./middleware/arject.middleware";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})

app.use("/api/v1/auth" , authRouter);
app.use("/api/v1/users" ,userRouter );
app.use("/api/v1/subcriptions" , subcriptionRouter);

app.use(errorMiddleware);

export default app;
