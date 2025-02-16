import {z} from 'zod'
console.log("inside signupschema ...............")

export const usernameVlaidation = z 
  .string()
  .min(2 , " username must be atleat 2 characters")
  .max(20 , "username must be no more than 20 charcaters")
  .regex(/^[a-zA-Z0-9_]+$/,"Usename must not contain special character")



  export const signUpSchema  = z.object({
    username : usernameVlaidation , 
    email : z.string().email({message:"Invalid email address"}),
    password:z.string().min(6 , {message:"password must be atleast 6 characters "})
  })

/*
  // Example data to be validated
const exampleData = {
  username: "trisha123",
  email: "trishasengupt27@gmail.com",
  password: "12345678",
};

// Validation logic
try {
  signUpSchema.parse(exampleData); // This will validate the object
  console.log("Validation passed");
} catch (err) {
  if (err instanceof z.ZodError) {
    console.log("Validation failed", err.errors); // Show validation errors
  }
}
*/