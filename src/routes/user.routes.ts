import {Router} from "express";
import { getUser, getUsers } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/" , getUsers);
userRouter.get("/:id" , getUser);


export default userRouter;