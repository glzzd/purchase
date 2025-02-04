import mongoose from "mongoose";

const structureSchema = new mongoose.Schema({
    head_office:{type:Number},
    office:{type:Number},
    department:{type:Number},
    division:{type:Number},
    isIndependent_office: {type:Boolean, default:false},
    isIndependent_department: {type:Boolean, default:false},
    isIndependent_division: {type:Boolean, default:false},
})

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    surname: {type: String, required:true},
    fathername: {type: String, required:true},
    gender: {type: String, enum:['male', 'female'], required:true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required:true},
    verifyOtp: {type: Number, default:null},
    verifyOtpExpireAt: {type: Number, default:null},
    isLoginVerified: {type: Boolean, default:false},
    isFirstLogin: {type: Boolean, default:true},
    resetOtp: {type: Number, default:null},
    resetOtpExpireAt: {type: Number, default:null},
    structure: {type:structureSchema}, 
    phone: {type: String},
    status: {type:String, enum:["active", "passive"], default:"active"}, 
    systemRole: {type:String, enum:["superadmin","admin","user"], default:'user'},
    rank: {type:String},
    position: {type:String}
})

const UserModel = mongoose.models.user || mongoose.model("user", userSchema);
export default UserModel