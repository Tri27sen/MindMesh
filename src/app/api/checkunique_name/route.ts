import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user";
import {z} from "zod"
import { usernameVlaidation } from "@/schemas/signUpSchema";


const UserQuerySchema = z.object({
  username : usernameVlaidation
})

//console.log(UserQuerySchema)
export async function GET(request :Request){
  await dbConnect()


  try{
     const {searchParams} = new URL(request.url)
     const queryParam ={
      username: searchParams.get('username')
     }
     // validate with zod 
     const result = UserQuerySchema.safeParse(queryParam)
     console.log(result)
     console.log("checking the name of user .....")
     if(!result.success){
        const usernameError = result.error.format().username?._errors||[]
        return Response.json({
          success:false ,
          message:usernameError?.length>0 ?usernameError.join(', '):'Invalid quesry parameters',
        },{status:400})
     }

     const {username} = result.data 
     const exsistinguserverifiedUser=await UserModel.findOne({username , isVerified:true})
     console.log(exsistinguserverifiedUser)
     if(exsistinguserverifiedUser) {
      return Response.json({
        success:false ,
        message:"Username is already taken"
      },{status:400})
   }
   return Response.json({
    success:true ,
    message:"Username is unique"
  },{status:200})


  }catch(error){
    console.error("error checking username",error)
    return Response.json(
      {
        sucess :false ,

        message :"error checking username"
      },
      {status:500}
    )
  }
}