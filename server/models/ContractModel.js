import mongoose from "mongoose";
import moment from "moment-timezone";

const contractSchema = new mongoose.Schema(
  {
    contract_name: { type: String },
    contract_no: { type: String, required: true },
    contract_between: { type: mongoose.Schema.Types.ObjectId, ref: "companies", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true } // createdAt ve updatedAt otomatik olarak eklenir
);

// Middleware: Kaydedilen timestamp'i Azerbaycan saatine göre ayarla
contractSchema.pre("save", function (next) {
  const now = moment().tz("Asia/Baku").toDate();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

const ContractModel = mongoose.models.contract || mongoose.model("contract", contractSchema);
export default ContractModel;
