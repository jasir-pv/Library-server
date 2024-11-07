import express from "express"
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/auth.js"
import userRoute from "./routes/user.js"
import booksRoute from "./routes/books.js"


dotenv.config(); 
const app = express();

const PORT = process.env.PORT || 3000


app.use(cors());

app.use(express.json({ limit: '50mb' })); // for JSON data
app.use(express.urlencoded({ limit: '50mb', extended: true })); // for URL-encoded data


app.use("/auth", authRoute)
app.use("/users", userRoute)
app.use("/books", booksRoute)


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






app.listen ( PORT, ()=>{
    console.log(`Server Running on port ${PORT}`);
    
} )
