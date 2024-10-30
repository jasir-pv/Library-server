import express from "express"
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/auth.js"

dotenv.config(); 
const app = express();

const PORT = process.env.PORT || 3000


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





// MongoDB connection

const CONNECTION_URL = process.env.CONNECTION_URL;

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.CONNECTION_URL);
      console.log("DB Connection successful");
    } catch (err) {
      console.error("DB Connection failed:", err);
    }
  };
  
  connectDB();

// API

  app.use("/api/auth", authRoute)



app.listen ( PORT, ()=>{
    console.log(`Server Running on port ${PORT}`);
    
} )
