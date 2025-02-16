import {NextAuthOptions} from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials" ; 
import bcrypt from"bcryptjs"
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user";
  


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect(); // Ensure DB is connected
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier }, // Use email as input
              { username: credentials.email }, // Assuming the same field
            ],
          });
          console.log("Credentials provided:", credentials);

          console.log("is error here")
          console.log("we are printing the user-----------------------")
          console.log(user);

          if (!user) {
            throw new Error("No user found with this email/username.");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account.");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password, // Fixed typo
            user.password // Fixed typo
          );

          if (isPasswordCorrect) {
            return user; // Return user on successful login
          } else {
            throw new Error("Incorrect Password.");
          }
        } catch (err:any ) {
          throw new Error(err.message || "Authentication failed.");
        }
      },
    }),
  ],
  callbacks:{
    async jwt({ token , user  }) {

      if(user){
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
        token.username = user.username
      }
      return token
    } , 
    async session({ session,  token }) {
      if(token){
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessages=token.isAcceptingMessages
        session.user.username = token.username
      }
      return session
    }
    
  },
  pages :{
    signIn:'/sign-in'
  } , 
  session:{
    strategy:"jwt"
  }, 
  secret :process.env.NEXTAUTH_SECRET
};
// is and all of them are created with html 


