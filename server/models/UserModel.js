import mongoose from "mongoose";

const structureSchema = new mongoose.Schema({
    head_office:{type:Number},
    office:{type:Number},
    department:{type:Number},
    division:{type:Number},
    isIndependent: {type:Boolean, default:false},
})

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    surname: {type: String, required:true},
    fathername: {type: String, required:true},
    gender: {type: String, enum:['male', 'female'], required:true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required:true},
    verifyOtp: {type: String, default:''},
    verifyOtpExpireAt: {type: Number, default:0},
    isAccountVerified: {type: Boolean, default:false},
    resetOtp: {type: String, default:''},
    resetOtpExpireAt: {type: Number, default:0},
    structure: {type:structureSchema}, 
    phone: {type: String},
    status: {type:String, enum:["active", "passive"], default:"active"}, 
    systemRole: {type:String, enum:["superadmin","admin","user"], default:'user'},
    rank: {type:String}
})

const UserModel = mongoose.models.user || mongoose.model("user", userSchema);
export default UserModel