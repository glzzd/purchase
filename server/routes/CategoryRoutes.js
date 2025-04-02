import express from "express"
// import { getAuthUserDetail } from "../middlewares/getUserDetail.js";
import { addCategory, getAllCategories, getMainCategory, getProduct, getSpecifications, getSubCategory } from "../controllers/CategoryController.js";

const categoryRouter = express.Router();


categoryRouter.get("/all-categories", getAllCategories)
categoryRouter.get("/main-categories", getMainCategory)
categoryRouter.get("/sub-categories/:parentId", getSubCategory)
categoryRouter.get("/product/:parentId", getProduct)
// categoryRouter.get("/product/product-types/:selectedProduct", getProductTypes)
categoryRouter.get("/product/get-specifications/:selectedProduct", getSpecifications)
categoryRouter.post("/add-category", addCategory);
export { categoryRouter };