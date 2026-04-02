const mongoose=require("mongoose");
const Department = require("./Department");

const quotaSchema=new mongoose.Schema({
    type:{
        type:String,
        enum:["KCET","COMEDK","Management"],
        required:true
    },
    seats:{
        type:Number,
        required:true
    },
    filledSeat:{
        type:Number,
        default:0
    }
})

const programSchema=new mongoose.Schema({
    name:
    {
        type:String,
        required:true
    },
    code:{
        type:String
    },
    //Since each departement has an program like engineering has IT,EC etc so each program is owned by any departement
    departmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department"
    },
    courseType:{
        type:String,
        enum:["UG","PG"]
    },
    academicYear:String,
    inTake:{
        type:Number
    },
    quotas:[quotaSchema]
})
const Program=new mongoose.model("Program",programSchema)
module.exports = Program;