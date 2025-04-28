import mongoose from "mongoose";

const raportSchema = new mongoose.Schema(
  {
    raport_by: { type: String, required: true },
    raport_temp_no: { type: String, required: true },
    raport_current_status: { type: String, enum: ['pending','rejected','onProcess','done'], default: "pending" },
    raport_no: { type: String, default:null },
    raport_url: { type: String, required: true },
  },
  { timestamps: true } // timestamp ekledik
);

const RaportModel = mongoose.models.raport || mongoose.model("raport", raportSchema);
export default RaportModel;
