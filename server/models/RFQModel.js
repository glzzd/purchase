import mongoose from "mongoose";


const rfqSchema = new mongoose.Schema({
    path: {type: String},
    created_by:  { type: mongoose.Schema.Types.ObjectId, ref: "user" }
},{ timestamps: true } )



const RFQModel = mongoose.models.rfq || mongoose.model("rfq", rfqSchema);


  
  export default RFQModel;