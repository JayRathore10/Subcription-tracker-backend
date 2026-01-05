import express  , {Request , Response} from "express";
import authRouter from "./routes/auth.routes";
import subcriptionRouter from "./routes/subcription.routes";
import userRouter from "./routes/user.routes";

const app = express();
app.use(express.json());

app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})

app.use("/api/v1/auth" , authRouter);
app.use("/api/v1/users" ,userRouter );
app.use("/api/v1/subcriptions" , subcriptionRouter);

export default app;
