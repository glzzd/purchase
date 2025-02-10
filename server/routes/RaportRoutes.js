import express from "express"
import { downloadRaport, getUserRaports } from "../controllers/RaportController.js";
import { allOrders, getOrderDetail, updateOrder } from "../controllers/OrderController.js";

const raportRouter = express.Router();

raportRouter.get("/get-raports", getUserRaports)
raportRouter.get("/download/:raportId", downloadRaport)

raportRouter.get("/get-orders", allOrders)
raportRouter.get("/get-orders/:orderId", getOrderDetail)
raportRouter.patch("/update/:id", updateOrder)

export { raportRouter };