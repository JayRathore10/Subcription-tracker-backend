import { Request } from "express";
import { UserInterface } from "../models/user.model";

export interface UserRequest extends Request {
  user ?: UserInterface
}