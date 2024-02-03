const { logger } = require("../../middlewares");

const {
    getAllGodsList, getGodDetailsById, addGodDetails, updateGodDetails, deleteGodDetails
} = require("../../services/god/god.service");

  exports.getAllGodsListController = async (req, res, next) => {
    try {
        const gods = await getAllGodsList();
        return res.status(200).json(gods);
    } catch (error) {
        logger.error('getAllGodsList Error:', error);
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal server error (getAllGodsList)' });
    }
  };

  exports.addGodDetailsController = async (req, res, next) => {
    try {
        const serviceResult = await addGodDetails(req);
        return res.status(serviceResult.status).json(serviceResult.data);
    } catch (error) {
        //logger.error('addGodDetailsController Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error (addGodDetails)' });
    }
  };

  exports.getGodDetailsByIdController = async (req, res) => {
    try {
        const serviceResult = await getGodDetailsById(req);
        return res.status(serviceResult.status).json(serviceResult.data);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Something went wrong please try again (getGodDetailsById)' });
    }
  };

  exports.updateGodDetailsController = async (req, res) => {
    try {
        const serviceResult = await updateGodDetails(req);
        return res.status(serviceResult.status).json(serviceResult.data);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Something went wrong please try again (updateGodDetails)' });
    }
  };

  exports.deleteGodDetailsController = async (req, res) => {
    try {
        const serviceResult = await deleteGodDetails(req);
        return res.status(serviceResult.status).json(serviceResult.data);
    } catch (error) {
        //logger.error('deleteGodDetails Error:', error);
        res.status(500).json({ success: false, error: 'Something went wrong please try again (deleteGodDetails)' });
    }
  };
