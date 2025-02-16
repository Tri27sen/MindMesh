import "next-auth"
import { DefaultSession } from "next-auth";


// see notes why we need extended types 


declare module 'next-auth'{
  interface User{
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?:boolean ;
    username?: string 
  }
  interface Session{
    user:{
      _id?:string;
      isVerified?: boolean;
      isAcceptingMessages?:boolean ;
      username?: string 
    } & DefaultSession['user']
  }
}


declare module 'next-auth/jwt'{
  interface JWT {
    
    _id?:string;
    isVerified?: boolean;
    isAcceptingMessages?:boolean ;
    username?: string 
  } 
    

}

//DefaultSession is part of the next-auth types and represents the default structure of a session object that NextAuth provides when a user is authenticated. By using DefaultSession['user'], you're referring to the user object that NextAuth defines by default for the session, which may include fields like name, email, and image (depending on the provider you're using for authentication).

