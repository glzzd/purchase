import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    mainCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'MainCategory', required: true },
  });
  
  const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);
  
export default SubCategoryModel;
