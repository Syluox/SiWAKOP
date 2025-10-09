// server.js or routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/sulap",async(req,res) =>{
    try{
        const {username,email} = req.body;
        if(username =="bukan sulap"){
            return res.status(400).json({message:"Bukan Sihir"});
        }
        else{
            return res.status(201).json({message:"Ga ASIK !"});
        }
    }catch(e){
        console.error(e);
    }
});

export default router;
