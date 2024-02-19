import  express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
 import ProductRoute from "./routes/product.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";


const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to update mongodb !");
      } catch (error) {
        throw error
      } 
    
}

mongoose.connection.on("disconnected", ()=>{
    console.log("disconnected  mongodb");
})

// middle were

app.get("/", (req, res)=>{
res.send("api set")
})
app.use("/api/auth",authRoute)
app.use("/api/products",ProductRoute)

app.use("/api/user", usersRoute);



app.listen(9000,()=>{
    connect()
    console.log("conneced to backended succsess");
})                                                                      



