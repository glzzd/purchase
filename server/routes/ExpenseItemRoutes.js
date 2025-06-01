import express from "express"
import { addExpenseItem, getAllExpenseItems, updateExpenseItem} from "../controllers/ExpenseItemController.js";


const expenseItemRouter = express.Router();


expenseItemRouter.get("/get-expense-items", getAllExpenseItems)
expenseItemRouter.post("/add-expense-item", addExpenseItem)
expenseItemRouter.put("/update-expense-item/:id", updateExpenseItem)


export { expenseItemRouter };