import dbConnect from "../../../lib/dbconnect";

import User from "../../../model/user";

import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import  {sendVerificationEmail}  from "../../../helpers/sendVerificationEmail";
// import  {sendVerificationEmail}  from "../../../helpers/sendVerificationEmail";

console.log("inside the sign-up api/route........")

export async function POST(request: NextRequest){
  await dbConnect()
    try {

        const reqBody = await request.json()
        const {username, email, password} = reqBody
        console.log("inside(auth)/route.ts")
        console.log(reqBody);

        //check if user already exists
        const exsistinguserverifiedbyusername = await User.findOne({username , isVerified:true})

        if(exsistinguserverifiedbyusername){
            return Response.json({
              success:false ,
              message: "User already exists"}, {status: 400})
        }
        console.log("working inside (auth)/sign-up .............")
        const exsistinguserbyemail = await User.findOne({email})

        const verifyCode =  Math.floor(100000 + Math.random()*900000).toString()
        if(exsistinguserbyemail ){
            if(exsistinguserbyemail.isVerified){
              return Response.json({
                success : false , 
                message : "User already exsist with this email "
              },{status:400})
            }else {
              const hashedPassword = await bcryptjs.hash(password , 10)
              exsistinguserbyemail.password = hashedPassword ;
              exsistinguserbyemail.verifyCode = verifyCode 
              exsistinguserbyemail.verifyCodeExpiry = new Date(Date.now() + 3600000)
              await exsistinguserbyemail.save()
            }
        }
        else{
        //hash password
        console.log("working new user .............")
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours()+1)
        console.log("still working.............")
        console.log(hashedPassword , salt , expiryDate )
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry : expiryDate ,
            isVerifies:false ,
            isAcceptingMessage:true ,
            messages:[]
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        //send verification email

        const emailResponse = await sendVerificationEmail(email, username , verifyCode)


        if(!emailResponse.success){
          return Response.json({
            success:false ,
            message: emailResponse.message
          },{status:500})
        }

      }
        return NextResponse.json({
           success: true,
            message: "User registered successfully . Please verify your email",
            
        },{status:201})


    } catch (error) {
        console.error('EROOR REGISTERING USER' , error)
        return Response.json(
          {
            success:false , 
            message:"error registering user"
          },
          {
            status:500
          }
        )
    }
}