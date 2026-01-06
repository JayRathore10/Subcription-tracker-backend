import { JwtPayload } from "jsonwebtoken";

export interface UserPlayLoad extends JwtPayload{
  userId : string  , 
  email : string 
}