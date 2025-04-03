import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', default: null },
    mainCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "MainCategory", default: null },

    specifications: [{
      name: { type: String, required: true }
    }]
  });
  
  const ProductModel = mongoose.model('Product', productSchema);
  export default ProductModel;