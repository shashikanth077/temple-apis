const { GetOrderDetailsById,getTranscationDetails } = require("../services/orderHistory.service");
const { logger } = require("../middlewares");

exports.getOrdersByUserIdType = async (req, res) => {
    try {
        const orderResult = await GetOrderDetailsById(req);
        return res.status(orderResult.status).json(orderResult.data);
    } catch (error) {
        logger.error('getOrdersByUserIdType Error:', error);
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal server error (getOrdersByUserIdType)' });
    }
};

exports.getTranscationDetails = async (req,res) => {
    try {
        const TransResult = await getTranscationDetails(req);
        return res.status(TransResult.status).json(TransResult.data);
    } catch {
        logger.error('getTranscationDetails Error:', error);
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal server error (getTranscationDetails)' });
    }
}


