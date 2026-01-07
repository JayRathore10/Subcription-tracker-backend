import dayjs from "dayjs";
import { emailTemplates } from "./email-template";
import { EMAIL } from "../configs/env.config";
import { transporter } from "../configs/nodemailer.config";

export const sendReminderEmail = async({to , type , subcription} : any)=>{
  try{
    if(!to || !type) throw new Error("Missing required parameters");

    const template = emailTemplates.find((t)=> t.label === type);

    if(!template) throw new Error("Invalid email type");

    const mailInfo = {
      userName : subcription.user.name ,
      subcriptionName : subcription.name ,
      renewalDate : dayjs(subcription.renewalDate).format('MMM D, YYYY') , 
      planName : subcription.name , 
      prices : `${subcription.currency} ${subcription.price} (${subcription.frequency})` ,
      paymentMethod : subcription.paymentMethod , 
    }

    const message = template.generateBody(mailInfo); 
    const subject = template.generateBody(mailInfo);

    const mailOptions = {
      from : EMAIL , 
      to : to , 
      subject : subject , 
      html : message  
    }

    transporter.sendMail(mailOptions , (err ,info)=>{
      if(err) return console.log(err , 'Error sending email');

      console.log("email sent " + info.response);
    })

  }catch(error){
    console.error(error);
    return ;
  }
}