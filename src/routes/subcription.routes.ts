import {Router} from "express";
import { authorize } from "../middleware/auth.middleware";
import { createSubcription } from "../controllers/subcription.controller";

const subcriptionRouter = Router();

subcriptionRouter.post("/" , authorize , createSubcription);

export default subcriptionRouter;