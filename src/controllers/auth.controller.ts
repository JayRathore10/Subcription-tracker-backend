import {Response,  Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user.model';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from '../configs/env.config';
import { UserPlayLoad } from '../types/userPlayLoad.types';
import { StringValue } from "ms";

export const signUp = async(req : Request ,res : Response , next : NextFunction)=>{
  const session = await mongoose.startSession();
  session.startTransaction();
  try{

    const {name , email , password} = req.body;

    // check all data 
    if(!name || !email || !password){
      const error : any = new Error(`Enter the information`);
      error.statusCode = 400;
      throw error; 
    }

    // Finding an existing error
    const existingUser = await User.findOne({email});

    if(existingUser){
      const error : any = new Error("User Already Exist");
      error.statusCode = 409;
      throw error;
    }

    // encrypts the password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{name , email , password : hashedPassword}], {session});

    const playLoad = {
      userId : newUsers[0]._id.toString()
    }

    
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      playLoad ,
      JWT_SECRET as string  ,
      {expiresIn : JWT_EXPIRES_IN as StringValue}) ;

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success : true ,
      message : "User created Successfully" , 
      data : {
        token , 
        user : newUsers[0]
      }
    })

  }catch(error){
    await session.abortTransaction();
    session.endSession();
    next(error); 
  }
}

export const signIn = async(req : Request , res : Response)=>{
  try{

  }catch(error){

  }
}

export const signOut = async(req : Request , res : Response)=>{
  try{

  }catch(error){
    
  }
}