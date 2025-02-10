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

const backetSchema = new mongoose.Schema({
    order_by: {type: String, required:true},
    order_for: {type: String, required:true},
    product: {type: String, required:true},
    product_type: {type: String, required:true},
    product_specifications: [{type: String}],
    order_count: {type: Number, required:true},
    order_reason: {type: String},
    order_note: {type: String},
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
    systemRole: {type:String, enum:["superadmin","admin","user",'purchase_admin'], default:'user'},
    rank: {type:String},
    position: {type:String}
})

const UserModel = mongoose.models.user || mongoose.model("user", userSchema);
export default UserModel