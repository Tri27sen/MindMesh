import {getServerSession} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user";
import{User} from "next-auth"



export async function POST(request:Request){
  await dbConnect();
  const session = await getServerSession(authOptions)
  console.log(session)
  const user = session?.user as User
  if(!session || !session.user){
    return Response.json(
      {
        sucess:false ,
        message:"Not Authenticated"
      },{status:401}
    )
  }
  const userId = user._id ;
  const{AcceptingMessage} = await request.json()
  try{
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId ,
       {isAcceptingMessage:AcceptingMessage} , 
       {new:true}
    )
    if(!updatedUser){
      return Response.json(
        {
          sucess:false ,
          message:"failed to update user status to accept messages "
        },{status:401}
      )
    }
      return Response.json(
        {
          sucess:true ,
          message:"updated user status to accept messages ",updatedUser
        },{status:200}
      )
  }catch(error){
    console.log("failed to update user status to accept messages " , error)
    return Response.json(
      {
        sucess:false ,
        message:"failed to update user status to accept messages "
      },{status:500}
    )
  }
}


export async function GET(request:Request){
  await dbConnect();
  console.log("Inside the GET route of accepting messages .....",request)
  const session = await getServerSession(authOptions)
  console.log(session)
  const user = session?.user as User
  if(!session || !session.user){
    return Response.json(
      {
        sucess:false ,
        message:"Not Authenticated"
      },{status:401}
    )
  }
  const userId = user._id ;
  try{
  const foundUser = await UserModel.findById(userId)
  if(!foundUser){
    return Response.json(
      {
        sucess:false ,
        message:"User not found"
      },{status:401}
    )
  }
  return Response.json(
    {
      sucess:true,
      isAcceptingMessages:foundUser.isAcceptingMessage,
      
    },{status:200}
  )
}catch(error){
  console.log("failed to update user status to accept messages " , error)
  return Response.json(
    {
      sucess:false ,
      message:"Error in accepting messages"
    },{status:500}
  )
}
}
