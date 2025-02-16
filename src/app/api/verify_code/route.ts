import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user";
import {z} from "zod"
import { usernameVlaidation } from "@/schemas/signUpSchema";




const UserQuerySchema = z.object({
  username : usernameVlaidation
})

console.log("working inside verify_code now .........")
console.log(UserQuerySchema)

export async function POST (request:Request){
  await dbConnect()
  try{

    console.log("I AM THE VERIFYING CODE .....")
    const {username , code } = await request.json()

    const decodedUsername = decodeURIComponent(username)
    const user = await UserModel.findOne({username:decodedUsername})

    if(!user){
      return Response.json(
        {
          sucess :false ,
  
          message :"User not found"
        },
        {status:500}
      )
    }
    const isCodevalid = user.verifyCode === code
    console.log("I GOT YOUR CODE  ;>")
    const iscodenotexpired = new Date(user.verifyCodeExpiry) > new Date()
    if(isCodevalid && iscodenotexpired){
      user.isVerified = true 
      await user.save()

      return Response.json(
        {
          sucess :true ,
  
          message :"Account verification done "
        },
        {status:200}
      )
    }

    else if(!iscodenotexpired){
      return Response.json(
        {
          sucess :false ,
          message :"verification code has expired please signup to get a new code "
        },
        {status:400}
      )
    }
    else {
      return Response.json(
        {
          sucess :false,
          message :"Verification code is incorrect"
        },
        {status:400}
      )
    }
  }catch(error){
    console.error("error verifying user",error)
    return Response.json(
      {
        sucess :false ,

        message :"error verifying user"
      },
      {status:500}
    )
}
}