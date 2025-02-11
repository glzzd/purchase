import mongoose from "mongoose";


const lotSchema = new mongoose.Schema({
    lot_no: {type: Number,},
    lot_name: {type: String, defaul:null},
    tenant: {type: String,defaul:null },
    contract_id:  { type: mongoose.Schema.Types.ObjectId, ref: "contract" },
    contract_no:  { type: String },
    created_by:  { type: mongoose.Schema.Types.ObjectId, ref: "user" }
},{ timestamps: true } )



const LotModel = mongoose.models.lot || mongoose.model("lot", lotSchema);


  
  export default LotModel;