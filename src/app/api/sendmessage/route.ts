import UserModel from "@/model/user";
import {Message} from "@/model/user";
import dbConnect from "@/lib/dbconnect";




export async function POST(request:Request){
  await dbConnect()
  const{username , content} = await request.json()
  try{
    const user = await UserModel.findOne({username})
    if(!user){
      return Response.json(
        {
          sucess:false ,
          message:"No user found"
        },{status:404}
      )
    }
    // is user accepting messages
    if(!user.isAcceptingMessage){
      return Response.json(
        {
          sucess:false ,
          message:"user is not accepting messages"
        },{status:403}
      )
    }
    const newMessages = {content , createdAt : new Date()}
    user.messages.push(newMessages as Message)
    await user.save()
    return Response.json(
      {
        sucess:true,
        message:"message send succesfully "
      },{status:200}
    )

    
  }
  catch(error){
    console.log("error wrinting messages ",error)
  return Response.json(
    {
      sucess:false ,
      message:"rror wrinting messages"
    },{status:500}
  )
  }
}