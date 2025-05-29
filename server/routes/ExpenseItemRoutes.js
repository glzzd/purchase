import express from "express"
import { addInternalExpenseItem, createNewContract, getAllInternalExpenseItems} from "../controllers/ExpenseItemController.js";


const expenseItemRouter = express.Router();


expenseItemRouter.get("/get-internal-expense-items", getAllInternalExpenseItems)
expenseItemRouter.post("/add-internal-expense-items", addInternalExpenseItem)


export { expenseItemRouter };