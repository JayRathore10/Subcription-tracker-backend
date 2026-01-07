import dotenv from "dotenv";

dotenv.config({path : `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
  PORT , 
  SERVER_URL,
  NODE_ENV ,
  DB_URI ,
  JWT_EXPIRES_IN ,
  JWT_SECRET  , 
  ARCJECT_ENV , 
  ARCJECT_KEY , 
  QSTASH_URL  , 
  QSTASH_TOKEN , 
  QSTASH_CURRENT_SIGNING_KEY ,
  QSTASH_NEXT_SIGNING_KEY , 
  EMAIL ,
  EMAIL_PASS
} = process.env;