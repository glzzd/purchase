import express from "express"
// import { getAuthUserDetail } from "../middlewares/getUserDetail.js";
import {  addSpecification, createMainCategory, createProduct, createSubCategory, getAllCategories, getMainCategory, getProduct, getSpecifications, getSubCategory, moveCategory } from "../controllers/CategoryController.js";

const categoryRouter = express.Router();


categoryRouter.get("/all-categories", getAllCategories)
categoryRouter.get("/main-categories", getMainCategory)
categoryRouter.get("/sub-categories/:parentId", getSubCategory)
categoryRouter.get("/product/:parentId", getProduct)
// categoryRouter.get("/product/product-types/:selectedProduct", getProductTypes)
categoryRouter.get("/product/get-specifications/:selectedProduct", getSpecifications)
categoryRouter.post("/add-main-category", createMainCategory);
categoryRouter.post("/add-sub-category", createSubCategory);
categoryRouter.post("/add-product", createProduct);
categoryRouter.post("/add-specification", addSpecification);
categoryRouter.put("/move", moveCategory);
export { categoryRouter };