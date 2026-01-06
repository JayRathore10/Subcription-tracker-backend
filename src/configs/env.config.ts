import dotenv from "dotenv";

dotenv.config({path : `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
  PORT ,
  NODE_ENV ,
  DB_URI ,
  JWT_EXPIRES_IN ,
  JWT_SECRET  , 
  ARCJECT_ENV , 
  ARCJECT_KEY
} = process.env;