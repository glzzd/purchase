import  mongoose from 'mongoose';

const ExpenseItemSchema = new mongoose.Schema({
    itemCode: { type: String, required: true },
    isInternal: { type: Boolean, required: true, default: true },
    description: { type: String, default: null },
    amount: {type: Number, required: true },
});

const ExpenseItemModel = mongoose.model("ExpenseItem", ExpenseItemSchema);

export default ExpenseItemModel;
