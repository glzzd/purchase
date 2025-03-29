import mongoose from 'mongoose';

const mainCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const MainCategoryModel = mongoose.model('MainCategory', mainCategorySchema);
export default MainCategoryModel;
