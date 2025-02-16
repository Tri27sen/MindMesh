import {Message} from "@/model/user"


export interface ApiResponse {
  success : boolean ; 
  message : string ; 
  isAceeptingMessages?:boolean
  messages?:Array<Message>
}