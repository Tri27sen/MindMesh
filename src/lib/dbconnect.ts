import mongoose from "mongoose";
// after database connection the data that is coming is  ut relevent data - type or not if you donot know abt it than you can skip it 
console.log("inside the dbconnect .......")

type ConnectionObject = {
  isConnected?: number 
}

const connection : ConnectionObject = {}

async function dbConnect(): Promise<void> {
  if(connection.isConnected){
    console.log("Alredy connected to daatbase");
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '' , {})
    console.log(db.connections)
    connection.isConnected = db.connections[0].readyState
    console.log("DB connected successfully");
  } catch(error){

    console.log("database connection failed" , error)
    process.exit(1)
  }
}



export default dbConnect ; 