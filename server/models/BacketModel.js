import mongoose from "mongoose";


const backetSchema = new mongoose.Schema({
    order_by: {type: String, required:true},
    order_by_fullname: {type: String, required:true},
    order_for: {type: String, required:true},
    product: {type: String, required:true},
    product_specifications: [{type: mongoose.Schema.Types.Mixed}],
    order_count: {type: Number, required:true},
    order_reason: {type: String},
    order_note: {type: String},
    is_raport_generated: {type:Boolean, default:false}
},{ timestamps: true } )



const BacketModel = mongoose.models.backet || mongoose.model("backet", backetSchema);
export default BacketModel