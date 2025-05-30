import mongoose from "mongoose";


const lotSchema = new mongoose.Schema({
    lot_no: {type: Number,},
    lot_name: {type: String, defaul:null},
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    contract_id:  { type: mongoose.Schema.Types.ObjectId, ref: "contract" },
    contract_no:  { type: String },
    created_by:  { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    rfq_id:  { type: mongoose.Schema.Types.ObjectId, ref: "rfq", default:null },
    expenseItem:  { type: mongoose.Schema.Types.ObjectId, ref: "expenseitems", default:null }
},{ timestamps: true } )



const LotModel = mongoose.models.lot || mongoose.model("lot", lotSchema);


  
  export default LotModel;