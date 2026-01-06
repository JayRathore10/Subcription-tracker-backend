import {Request , Response , NextFunction} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/env.config";
import { UserPlayLoad } from "../types/userPlayLoad.types";
import { User } from "../models/user.model";
import { UserRequest } from "../types/userRequest.types";

export const authorize = async (req : UserRequest  , res :Response , next : NextFunction)=>{
  try{
    let token ;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1]; 
    }

    if(!token) return res.status(401).json({message : 'Unauthorized'});

    const decoded = jwt.verify(token , JWT_SECRET as string ) as UserPlayLoad ;

    const user = await User.findById(decoded.userId); 

    if(!user){
      return res.status(401).json({message : 'Unauthorized'});
    }

    req.user = user; 

    next();

  }catch(error : any){
    return res.status(401).json({
      message : 'Unathorized', 
      error : error.message 
    })
  }
}