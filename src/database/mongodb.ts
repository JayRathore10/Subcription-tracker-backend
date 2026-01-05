import mongoose from "mongoose";
import {NODE_ENV , DB_URI} from "../configs/env.config";

if(!DB_URI){
  throw new Error("Please define the MONGODB_URI environment variable inside .env<development/production>.local");
}

export const connectToDatabase = async()=>{
  try{
    await mongoose.connect(DB_URI as string);

    console.log(`Connected to database in ${NODE_ENV} mode`);

  }catch(error){
    console.error('ERROR connecting to database' , error);
    process.exit(1);
  }
} 