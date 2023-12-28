const { logger } = require("../middlewares");

const {
    getAllProducts, createProduct, getProductById, updateProduct, deleteProduct
  } = require("../services/product.service");

  exports.getAllProductsController = async (req, res, next) => {
    try {
        const getAllProductsService = await getAllProducts();

        return res.status(200).json(getAllProductsService);

    } catch (error) {
        logger.error('getAllProducts Error:', error);
        res.status(500).json({ error: 'Internal server error (getAllProducts)' });
    }
  };

  exports.createProductController = async (req, res, next) => {
    try {
        const newProductService  = await createProduct(
            req.body,
          );

        return res.status(200).json(newProductService);

    } catch (error) {
        //logger.error('createProductController Error:', error);
        res.status(500).json({ error: 'Internal server error (createProduct)' });
    }
  };

  exports.getProductByIdController = async (req, res) => {
    try {
        const getProductByIdService = await getProductById(req);
        return res.status(getProductByIdService.status).json(getProductByIdService.data);
    } catch (error) {
        //logger.error('getSingleProduct Error:', error);
        res.status(500).json({ error: 'Something went wrong please try again (getProductById)' });
    }
  };

  exports.updateProductController = async (req, res) => {
    try {
        const productService = await updateProduct(req);
        return res.status(productService.status).json(productService.data);
    } catch (error) {
        //logger.error('updateProduct Error:', error);
        res.status(500).json({ error: 'Something went wrong please try again (updateProduct)' });
    }
  };

  exports.deleteProductController = async (req, res) => {
    try {
        const productService = await deleteProduct(req);
        return res.status(productService.status).json(productService.data);
    } catch (error) {
        //logger.error('deleteProduct Error:', error);
        res.status(500).json({ error: 'Something went wrong please try again (deleteProduct)' });
    }
  };
