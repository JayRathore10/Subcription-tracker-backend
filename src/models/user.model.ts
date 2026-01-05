import mongoose, {Document} from "mongoose";

export interface UserInterface extends Document {
  name : string , 
  email : string , 
  password : string
}

const userSchema = new mongoose.Schema<UserInterface>({
  name : {
    type : String ,
    required: [true, "User name is required"] ,
    trim : true , 
    minLength : 2 , 
    maxLength : 50 
  } , 
  email : {
    type : String  ,
    required: [true , "User Email is required"]  ,
    trim : true , 
    unique : true , 
    lowercase : true ,
    match : [/\S+@\S+\.\S+/, 'Please fill a valid email address']
  } ,
  password : {
    type : String , 
    required: [true , "User Password is needed"] ,
    minLength : 6 ,  
  }
} , {timestamps : true});

export const User = mongoose.model<UserInterface>("User" , userSchema);
