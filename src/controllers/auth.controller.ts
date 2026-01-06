import {Response,  Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user.model';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET , NODE_ENV} from '../configs/env.config';
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

    res.cookie("token" , token);

    return res.status(201).json({
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

export const signIn = async(req : Request , res : Response , next :NextFunction)=>{
  try{
    const {email , password} = req.body;

    if(!email || !password){
      const error : any = new Error("Enter all information");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findOne({email});

    if(!user){
      const error : any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password , user.password); 

    if(!isPasswordValid){
      const error : any = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({userId : user._id} , JWT_SECRET as string , {expiresIn : JWT_EXPIRES_IN as StringValue} );

    res.cookie("token" , token);

    return res.status(200).json({
      success : true , 
      message : "User signed in successfully" ,
      data:{
        token , 
        user
      }
    });

  }catch(error){
    next(error);
  }
}

export const signOut = async(req : Request , res : Response , next: NextFunction)=>{
  try{
    return res.clearCookie("token" , {
      httpOnly : true ,   
      secure : NODE_ENV === "production" , 
      sameSite :"strict"
    }).status(200).json({
      success : true   ,
      message :  "Logged out Successfully"
    })
  }catch(error){
    next(error) ;  
  }
}