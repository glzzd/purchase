import mongoose from "mongoose";


const lotSchema = new mongoose.Schema({
    lot_no: {type: Number,},
    lot_name: {type: String, defaul:null},
    tenant: {type: String,defaul:null },
    contract_no: {type: String,defaul:null}
},{ timestamps: true } )



const LotModel = mongoose.models.lot || mongoose.model("lot", lotSchema);


  
  export default LotModel;