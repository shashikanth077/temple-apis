const Product = require("../../models/shop/product.model");
const { logger } = require("../../middlewares");
const { PUBLIC_URL } = require("../../utils/constants")
const {isNullOrUndefined} = require("../../utils")

const getAllProducts  = async () => {
    const products = await Product.find({deleted: false});
    return { products, count: products.length };
};

const createProduct = async (req) => {

    const imagePath = PUBLIC_URL+'uploads/products/'+req.file.filename;
    req.body.image = imagePath;

    await new Product({
        name: req.body.name,
        price: req.body.price,
        discount: req.body.discount,
        image: req.body.image,
        shortDescription: req.body.shortDescription,
        fullDescription: req.body.fullDescription,
        categories: req.body.categories,
        stock: req.body.stock,
        createdAt: Date.now(),
        modifiedAt: Date.now()
    }).save();

    const data = { success: true, message: 'Product details added successfully' };
    return { data, status: 200 };

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

    if(isNullOrUndefined(req.file?.filename)){
        req.body.image = existingProduct.image;
    } else {
        const imagePath = PUBLIC_URL+'uploads/products/'+req?.file?.filename;
        req.body.image = imagePath;     
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
