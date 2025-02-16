'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "../../../types/ApiRespose";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Verified, BadgeX, Eye , EyeOff } from "lucide-react"

const Page = () => {
  const { toast } = useToast();
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setISSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter()

  const form  = useForm <z.infer<typeof signUpSchema>> ({
    resolver : zodResolver(signUpSchema),
    defaultValues : {
      username : '',
      email : '',
      password : ''
    }
  })
  console.log(usernameMessage)
  useEffect(()=>{
    const checkUsernameUnique = async () => {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/checkunique_name?username=${username}`);
          console.log("the response message is",response.data.message)
          setUsernameMessage(response?.data?.message)
          console.log("the response is ",response)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError?.response?.data?.message ?? "Error in Checking Username")
        }finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])


  const onSubmit = async (data : z.infer<typeof signUpSchema>) => {
    //we get data from on submit from handlesubmit
    setISSubmitting(true);
    console.log(data)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      console.log("sending message ...")
      toast({
        title : 'Signup Successful',
        description : response?.data?.message
      })
      router.replace(`/verify/${username}`)
      
    } catch (error) {
      console.error("error in sign up " , error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError?.response?.data?.message
      toast({
        title : 'Signup Failed',
        description : errorMessage?? "An Error Occurred",
        duration : 3000,
        variant : "destructive"
      })
    }finally{
      setISSubmitting(false)
    }
  }

  return(
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join MysteryMSG
          </h1>
          <p className="mb-4">
            Sign up to start your <span></span>anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                  placeholder="Username" 
                  autoComplete="off"
                  {...field} 
                  onChange={(e)=>{
                    field.onChange(e)
                    debounced(e.target.value)
                  }} 
                  />
                </FormControl>
                {isCheckingUsername && <Loader2 className="animate-spin" />}
                <p className={`text-sm flex items-center ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                {usernameMessage}
                {usernameMessage === "Username is available" && (
                  <Verified className="ml-1 w-4 h-4" />
                )}
                {usernameMessage != 'Username is unique' && usernameMessage &&  (
                  <BadgeX className="ml-1 w-4 h-4" />
                )}
              </p>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                  placeholder="Enter your email address" 
                  {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Set a Password"
                      {...field}
                      className="pr-10"  // Add padding to the right to avoid overlap with the icon
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                      {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5"/>}
                    </span>
                  </div> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4" type="submit" disabled={isSubmitting}>
            {
              isSubmitting ? (
                <>
                <Loader2 className = "mr-2 h-4 w-4 animate-spin" /> Please Wait
                </>
              ) : ( 'Signup' )
            }
          </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
            <p>
              Already a member?{' '}
              <Link href="/sign-in"  className="text-blue-500 hover:text-blue-600">
                sign-in
              </Link>
            </p>
        </div>
      </div>
    </div>
  )

}
export default Page;