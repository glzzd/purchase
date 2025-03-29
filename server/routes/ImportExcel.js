import express from "express";
import multer from "multer";
import { parseAndSaveExcel } from "../controllers/ParseExcelController.js";

const parseExcelRouter = express.Router();
const upload = multer(); 

parseExcelRouter.post("/upload", upload.single("file"), parseAndSaveExcel);

export { parseExcelRouter };
