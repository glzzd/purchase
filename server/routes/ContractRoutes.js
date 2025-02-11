import express from "express"
import { createNewContract, getAllContracts, getContractDetails, updateContractDetails } from "../controllers/ContractController.js";


const contractRouter = express.Router();


contractRouter.post("/create", createNewContract)
contractRouter.get("/all-contracts", getAllContracts)
contractRouter.get("/all-contracts/:contractId", getContractDetails)
contractRouter.patch("/all-contracts/update/:contractId", updateContractDetails)


export { contractRouter };