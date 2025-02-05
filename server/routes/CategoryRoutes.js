import express from "express"
// import { getAuthUserDetail } from "../middlewares/getUserDetail.js";
import { getMainCategory, getProduct, getProductTypes, getSpecifications, getSubCategory } from "../controllers/CategoryController.js";

const categoryRouter = express.Router();


categoryRouter.get("/main-categories", getMainCategory)
categoryRouter.get("/sub-categories/:parentId", getSubCategory)
categoryRouter.get("/product/:parentId", getProduct)
categoryRouter.get("/product/product-types/:selectedProduct", getProductTypes)
categoryRouter.get("/product/product-types/specifications/:selectedProductType", getSpecifications)

export { categoryRouter };