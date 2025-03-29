import express from "express"

import { updateOrder } from "../controllers/OrderController.js";

const orderRouter = express.Router();

orderRouter.patch("/update", updateOrder)

export { orderRouter };