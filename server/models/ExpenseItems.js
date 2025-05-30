import  mongoose from 'mongoose';

const ExpenseItemSchema = new mongoose.Schema({
    itemCode: { type: String, required: true },
    isInternal: { type: Boolean, required: true, default: true },
    description: { type: String, default: null },
    amount: {type: Number, required: true },
    blockedBalance: { type: Number, default: 0 },
    purchaseHistory: [
        {
            purchaseDate: { type: Date, default: Date.now },
            amount: { type: Number, required: true },
            description: { type: String, default: null }
        }
    ]
});

const ExpenseItemModel = mongoose.model("ExpenseItem", ExpenseItemSchema);

export default ExpenseItemModel;
