import dayjs from "dayjs";
import { createRequire } from "module";
import { Subcription } from '../models/subcription.model';
import { serve } from "@upstash/workflow/express";
import { sendReminderEmail } from '../utils/send-email';


const REMAINDERS = [7, 5 ,2 , 1];

export const sendReminders = serve(async(context : any)=>{
  const { subcriptionId } = context.requestPlayload;
  const subcription = await fetchSubcription(context, subcriptionId);

  if(!subcription || subcription.status !== "active")return ;

  const renewalDate = dayjs(subcription.renwalDate);

  if(renewalDate.isBefore(dayjs())){
    console.log(`Renewal date has passed for subcription ${subcriptionId} . Stopping Workflow`);
    return ;
  }

  for(const daysBefore of REMAINDERS){
    const remainderDate = renewalDate.subtract(daysBefore , 'day');

    if(remainderDate.isAfter(dayjs())){
      await sleepUntilRemainder(context , `Reminder ${daysBefore} days before` , remainderDate);
    }

    await triggerReminder(context, `${daysBefore} days before reminder` ,subcription);

  }

});

const fetchSubcription = async(context : any , subcriptionId : any)=>{
  return await context.run("get subcription" , ()=>{
    return Subcription.findById(subcriptionId).populate("user" , 'name email');
  })
}

const sleepUntilRemainder = async(context : any , label : any , date : any)=>{
  console.log(`Sleeping until ${label} remainder at ${date}`);

  await context.sleepUntil(label , date.toDate());

}

const triggerReminder = async(context :any , label  : any , subcription : any)=>{
  return await context.run(label , async ()=>{
    console.log(`Triggering ${label} remainder`);

    await sendReminderEmail({
      to : subcription.user.email ,
      type : label , 
      subcription 
    })

  })
}