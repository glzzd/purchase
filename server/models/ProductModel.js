import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    specifications: [{ type: String }],
  });
  
  const ProductModel = mongoose.model('Product', productSchema);
  export default ProductModel;