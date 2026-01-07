import mongoose , {Document, HydratedDocument} from "mongoose";
import { Frequency , Currency , SubscriptionStatus, Category } from "../types/subcription.types";

export interface SubcriptionInterface {
  name : string , 
  price : number , 
  currency : Currency ,
  frequency : Frequency , 
  category : Category , 
  paymentMethod : string , 
  status : SubscriptionStatus , 
  startDate : Date , 
  renewalDate ?: Date , 
  user : mongoose.Schema.Types.ObjectId
}

export type SubcriptionDocument = HydratedDocument<SubcriptionInterface>;

const subcriptionSchema = new mongoose.Schema<SubcriptionInterface>({
  name : {
    type : String  ,
    required : [true , 'Subcription name is required'] , 
    trim : true , 
    minLength : 2 , 
    maxLength: 100
  } , 
  price : {
    type : Number , 
    required : [true , "Subcription price is required"] , 
    min : [0 , "price must be greater than 0"]
  } , 
  currency :{
    type : String , 
    enum : ["USD" , "EUR", "GBP"],
    default : "USD"
  }, 
  frequency: {
    type : String ,
    enum : ['daily' , 'weekly' , 'monthly' , 'yearly'] , 
    required : true 
  }, 
  category:{
    type : String , 
    enum : ["sports" , "news", "entertainment" , "lifestyle" , "technology" , "finance" , "politics" , "other" ] ,
    required : true ,
  } ,
  paymentMethod : {
    type : String ,
    required: true ,
    trim : true 
  }, 
  status : {
    type : String, 
    enum : ["active" , "cancelled" , "expired"] , 
    default : "active"
  } , 
  startDate : {
    type : Date ,
    required: true ,
    validate : {
      validator : function(value : Date){
        return value <= new Date();
      } ,
      message : "Start date must be in the past"
    }
  }, 
  renewalDate : {
    type : Date , 
    validate :  {
      validator : function( this : any ,  value : Date){
        if(!value) return true;
        return value > this.startDate;
      } , 
      message : "Renewal date must be after the start date",
    }
  } ,
  user : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "User", 
    required : true , 
    index : true , 
  }
}, {timestamps : true});

// Auto Calculate renewal date is missing 
subcriptionSchema.pre("save" , function(this : SubcriptionInterface, next : any){
  if(!this.renewalDate){
    const renewalPeriods = {
      daily : 1, 
      weekly : 7, 
      monthly : 30 , 
      yearly : 365
    };

    const days = renewalPeriods[this.frequency!];

    if (!days) {
        throw new Error("Invalid subscription frequency");
    }

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + days);

  }
  // Auto-update the status if renewal  date has passed 

  if(this.renewalDate < new Date()){
    this.status  = 'expired';
  }

})

export const Subcription = mongoose.model<SubcriptionInterface>("Subcription" , subcriptionSchema);