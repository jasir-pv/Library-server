import express, { Router } from "express"
import dotenv from "dotenv"
import User from "../models/User.js"
import CryptoJS from "crypto-js"
// import jwt from "jsonwebtoken"

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
 
            const { password, ...others} =user._doc

            res.status(200).json(user)

        }catch(err){
            console.log("there have some problem")
        }
 
    })




    export default router;