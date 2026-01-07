import {Router} from "express";
import { authorize } from "../middleware/auth.middleware";
import { createSubcription, getUserSubcriptions } from "../controllers/subcription.controller";

const subcriptionRouter = Router();

subcriptionRouter.post("/" , authorize , createSubcription);

subcriptionRouter.get("/user/:id" , authorize  , getUserSubcriptions);

export default subcriptionRouter;