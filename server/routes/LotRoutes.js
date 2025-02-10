import express from "express"
import { createLot, getAllLots } from "../controllers/LotController.js";


const lotRouter = express.Router();


lotRouter.post("/create", createLot)
lotRouter.get("/get-all-lots", getAllLots);


export { lotRouter };