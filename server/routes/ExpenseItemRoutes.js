import express from "express"
import { addInternalExpenseItem, createNewContract, getAllExpenseItems} from "../controllers/ExpenseItemController.js";


const expenseItemRouter = express.Router();


expenseItemRouter.get("/get-expense-items", getAllExpenseItems)
expenseItemRouter.post("/add-internal-expense-items", addInternalExpenseItem)


export { expenseItemRouter };