//modules / packages
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")
const User = require("./models/User")
// my server instance
const app = express()
const Joi = require('joi');
const bcryptjs = require("bcryptjs")


// Todos : 
// Improve my server  : 
    // 1 - add Data validation with joi
    // 
//  




const createUserValidation = Joi.object({
    fullname : Joi.string().min(6).required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),




    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
})
   



app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// GET All users
app.get("/users",async (req,res)=>{
    const users = await User.find()
    res.json(users)
})


//get user by id
app.get("/users/:id",async (req,res)=>{
    let userId = req.params.id
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(400).json({msg : "bad request error in ID"})
    }
    try {
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({msg:"user not found"})
        }
        res.json(user)

    }catch(err){
        console.log("error in server")
    }
})

//create user 
app.post("/users",async (req,res)=>{
    console.log(req.body)
    let validation = createUserValidation.validate(req.body)
    if(validation.error){
       return res.status(400).json({error : validation.error.details})
    }
    let userAlreadyExist = await User.findOne({email:validation.value.email})
    console.log(userAlreadyExist)
    if (userAlreadyExist){
        return res.json({msg:"User with this email already exists"})
    }
    var salt = bcryptjs.genSaltSync(10);
    let {password} = req.body

    var hashedPassword = bcryptjs.hashSync(password, salt);
    
    let user = new User({...validation.value,password : hashedPassword})
    await user.save()

    res.status(201).json(user)
})

//update user
app.put("/users/:id",async (req,res)=>{
    let userId = req.params.id
    let  { email,password, fullname} = req.body
    let user = await User.findByIdAndUpdate(userId, {
        email,
        password,
        fullname
    })
    user.save()
    res.json(user)
})


//get user by id
app.delete("/users/:id",async (req,res)=>{
    let userId = req.params.id
    let user =   await User.findByIdAndDelete(userId)
    res.json(user)
})  



// method for listening on port 8000
app.listen(8000,()=>{
    console.log("listrning on port 8000")
    connectDB()
})


function connectDB(){
    mongoose.connect('mongodb+srv://test1:test1@cluster0.lmoyc.mongodb.net/dimanche?retryWrites=true&w=majority')
    .then(()=>{
        console.log("connected to db")
    })
    .catch(err=>{
        console.log(err)
        console.log("error in connection")
    })
}