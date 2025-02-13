import mongoose from "mongoose";


const companySchema = new mongoose.Schema({
  company_name: { type: String, required: true }, 
  company_voen: { type: String, required: true, unique:true }, 
  company_legal_form: { type: String, required: true }, 
  company_address: {
    street: { type: String}, 
    city: { type: String },
    postal_code: { type: String }, 
    country: { type: String }, 
  },
  company_contact_details: {
    phone_number: { type: String }, 
    email: { type: String, unique: true }, 
    website: { type: String },
  },
  company_industry: { type: String },
  company_ceo_name: { type: String, required: true }, 
  company_description: { type: String },
}, { timestamps: true }); 

const CompanyModel = mongoose.models.Company || mongoose.model("Company", companySchema);

export default CompanyModel;
