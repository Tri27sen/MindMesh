import {resend} from "../lib/resend" ;
import VerificationEmail from "../../emails/VericationEmail"
import {ApiResponse} from "../types/ApiRespose";


console.log("working for the mail verification ----1");
export async function sendVerificationEmail (
  email :string , 
  username :string ,
  verifyCode :string
): Promise<ApiResponse>{
  try {
     // Create email content synchronously
    

    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Verification email',
      react: VerificationEmail({username ,otp:verifyCode}),
    });
    console.log("working for the mail verification ----2");
    return { success:true , message:"Verification email sent successfully"}
  } catch (emailError){
    console.error("error sending verification error ", emailError)
    return {success:false , message:"failed to send verification error"}
  }
}