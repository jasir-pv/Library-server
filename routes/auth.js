import express, { Router } from "express"
import dotenv from "dotenv"
import User from "../models/User.js"
import CryptoJS from "crypto-js"
import jwt from "jsonwebtoken"

dotenv.config()

const router = express.Router()

// Register

     router.post("/register",async (req,res)=>{
        
        const pass = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC).toString()
            console.log(pass, "encypted password")
        
        const newUser = new User({
            username:req.body.username,
            email: req.body.email,         
            password:pass  
               
        })     
        try{
            const savedUser = await newUser.save()
            res.status(201).json(savedUser)
            console.log(savedUser)
        }catch(err){
            res.status(500).json(err)
        } 
     })

     
    router.post("/login", async( req,res)=>{
        try{
            const user= await User.findOne({username:req.body.username})
            !user && res.status(401).json("User Not Found")

            const decryptedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            ).toString(CryptoJS.enc.Utf8)
           
            if (decryptedPassword !== req.body.password) {
                return res.status(401).json("Invalid credentials");
            }

            const accessToken = jwt.sign({
                id:user._id, isAdmin: user.isAdmin
            },process.env.JWT_SEC,
        {expiresIn:"3d"})
 
            const { password, ...others} =user._doc

            res.status(200).json({user,accessToken})

        }catch(err){
            console.log("there have some problem")
        }
 
    })


    router.get('/verifyToken', async (req, res) => {
        try {
          const token = req.headers.token.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id);
          if (user) {
            res.status(200).json({ user });
          } else {
            res.status(401).json({ message: "Invalid token" });
          }
        } catch (error) {
          res.status(401).json({ message: "Token verification failed" });
        }
      });




    export default router;