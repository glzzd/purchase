import express from "express"
import { createNewRFQ, downloadRFQ } from "../controllers/RFQController.js";


const rfqRouter = express.Router();


rfqRouter.post("/create", createNewRFQ)
rfqRouter.get("/download/:rfq_id", downloadRFQ)


export { rfqRouter };