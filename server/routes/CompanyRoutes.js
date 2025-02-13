import express from "express"
import { addCompany, getAllCompanies, getCompanyDetails, updateCompanyDetail } from "../controllers/CompanyController.js";


const companyRouter = express.Router();

companyRouter.post("/add", addCompany)
companyRouter.get("/all-companies", getAllCompanies)
companyRouter.get("/all-companies/:companyId", getCompanyDetails)
companyRouter.patch("/update/:companyId", updateCompanyDetail)

export { companyRouter };