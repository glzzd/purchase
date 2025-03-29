import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    order_by: {type: String, required:true},
    backet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'backet', required: true }, 
    order_by_fullname: {type: String, required:true},
    order_for: {type: String, required:true},
    product: {type: String, required:true},
    raport_id:{type: String, required:true},
    raport_no_from_bc:{type: String, default:null},
    product_type: {type: String, required:true},
    product_specifications: [{type: mongoose.Schema.Types.Mixed}],
    order_count: {type: Number, required:true},
    order_reason: {type: String},
    order_note: {type: String},
    order_status: {type: String, enum:['pending','rejected','onProcess','done'], default:null},
    tenant: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    lot_no:{type:String, default:null},
    contract_no:{type:String, default:null}
},{ timestamps: true })



const OrderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default OrderModel