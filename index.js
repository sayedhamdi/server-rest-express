//modules / packages
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")
const User = require("./models/User")
// my server instance
const app = express()



// what is this ??????? Middlewares

// are functions that exectue before getting to the endpoint
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
    let {fullname,email,password} = req.body

    let user = new User({
        fullname,
        email,
        password
    })
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