import {  Response , NextFunction } from "express";
import { Subcription } from "../models/subcription.model";
import { UserRequest } from "../types/userRequest.types";

export const createSubcription = async(req : UserRequest , res : Response, next : NextFunction)=>{
  try{

    if(!req.user){
      const error:any = new Error("User data is missing");
      error.statusCode = 404;
      throw error;
    }

    const subcription = await Subcription.create({
      ...req.body , 
      user : req.user?._id
    });

    return res.status(201).json({
      success : true , 
      data : subcription
    });

  }catch(error){
    next(error);
  }
}