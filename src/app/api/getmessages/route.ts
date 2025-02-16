import {getServerSession} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user";
import{User} from "next-auth"
import mongoose from "mongoose";



export async function GET(request:Request){
  await dbConnect();
  const session = await getServerSession(authOptions)
  //console.log(session)
  const user = session?.user as User
  console.log("the user is -----------------",session?.user);
  if(!session || !session.user){
    return Response.json(
      {
        sucess:false ,
        message:"Not Authenticated"
      },{status:401}
    )
  }
  const userId = new mongoose.Types.ObjectId(user._id) ;
  try{
    const user = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) }}, // Use _id not id
  {$unwind: {
    path: '$messages',
    preserveNullAndEmptyArrays: true // Keep users with no messages
  }},
  {$sort: {'messages.createdAt': -1}},
  {$group: {_id: '$_id', messages: {$push: '$messages'}}}
])
    console.log("userId:", userId);
    console.log("Query result:", user);
    if(!user || user.length ===0){
      return Response.json(
        {
          sucess:false ,
          message:"User not found"
        },{status:401}
      )
    }
    return Response.json(
      {
        sucess:true ,
        messages:user[0].messages
      },{status:200}
    )
  }catch(error){
    console.log("Unsuccessful in sending messages",error)
    return Response.json(
      {
        sucess:false ,
        message:"Unsuccessful in sending messages"
      },{status:400}
    )
  }
}