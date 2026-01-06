import {Request , Response , NextFunction} from "express";
import { User } from "../models/user.model";

export const getUsers = async(req : Request ,res : Response , next : NextFunction)=>{
  try{
    const users  = await User.find();

    if(users.length === 0){
      const error : any = new Error("No User found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success : true  , 
      data : users 
    })

  }catch(error){
    next(error);
  }
}

export const getUser = async(req : Request , res : Response , next : NextFunction)=>{
  try{  
    const user = await User.findById(req.params.id).select("-password");

    if(!user){
      const error : any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success : true , 
      data : user 
    })

  }catch(error){
    next(error);
  }
}