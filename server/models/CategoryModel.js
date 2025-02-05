import  mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    specifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specification' }]
});

const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;
