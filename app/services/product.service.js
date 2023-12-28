const Product = require("../models/product.model");
const { logger } = require("../../app/middlewares");

const getAllProducts  = async () => {
    
    const products = await Product.find({deleted: false});
 
    return { products, count: products.length };
};

const createProduct = async (req) => {
    await new Product({
            name: req.name,
            price: req.price,
            discount: req.discount,
            image: req.image,
            shortDescription: req.shortDescription,
            fullDescription: req.fullDescription,
            categories: req.categories,
            stock: req.stock,
            createdAt: Date.now(),
            modifiedAt: Date.now()
    }).save();
    return { success: true, message: 'New Product Created successfully' };
  };

  const getProductById = async (req) => {
    const product = await Product.findOne({ _id: req.params.id, deleted: false});

    if (!product) { 
        const data = { success: false, message: "Product doesn't exist"};
        return {data, status: 404 };
    } else {
        const data = { success: true, product};
        return {data, status: 200 };
    }
};

const updateProduct = async (req) => {
    const existingProduct = await Product.findOne({_id: req.params.id, deleted: false});

    if (!existingProduct) {
        const data = { success: false, message: "Product doesn't exist"};
        return {data, status: 404 };
    }

    const product = await Product.findByIdAndUpdate(req.params.id, 
        {$set: req.body},
        { runValidators: true, new: true });
        const data = { success: true,  message: "Product updated successfully", product};
        return {data, status: 200 };
};

const deleteProduct = async (req) => {
    const existingProduct = await Product.findOne({ _id: req.params.id, deleted: false});

    if (!existingProduct) {
        const data = { success: false, message: "Product doesn't exist"};
        return {data, status: 404 };
    }

    const product = await Product.findByIdAndUpdate(req.params.id, 
        {$set: {'deleted': true}, 'modifiedAt': Date.now()});
         
        const data = { success: true, message: "Product deleted successfully", product };
        return {data, status: 200 };
};

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};
