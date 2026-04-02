const express=require("express");
const cors=require("cors");
const connectDB = require("./db/db");
const mainRouter=require("./routers/mainRouter");
const app=express();
require("dotenv").config();
const PORT=3000|process.env.PORT;
connectDB();
app.use(express.json());
app.use(cors())
app.use("/api/v1",mainRouter);
app.get("/",(req,res)=>{
    res.json({
        msg:"Hello there"
    })
})
app.listen(PORT,()=>{
    console.log(`We are listening this app on ${PORT}`)
})