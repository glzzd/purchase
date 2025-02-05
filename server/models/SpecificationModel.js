import  mongoose from 'mongoose';

const SpecificationSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    values: [
        {
            value: { type: String, required: true },   
            example: { type: String, default: '' }     
        }
    ]
});

const SpecificationModel = mongoose.model("Specification", SpecificationSchema);

export default SpecificationModel;