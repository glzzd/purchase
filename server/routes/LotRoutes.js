import express from "express"
import { createLot, getAllLots, getLotDetails, updateLotDetails } from "../controllers/LotController.js";


const lotRouter = express.Router();


lotRouter.post("/create", createLot)
lotRouter.get("/get-all-lots", getAllLots);
lotRouter.get("/get-all-lots/:lotId", getLotDetails);
lotRouter.patch("/update/:lotId", updateLotDetails);


export { lotRouter };