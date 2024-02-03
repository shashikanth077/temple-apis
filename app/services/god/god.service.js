const God = require("../../models/god/god.model");
const Service = require("../../models/services/service.model");
const { logger } = require("../../middlewares");
const { allowedWorshipDays,PUBLIC_URL }  = require("../../utils/constants");
const { isNullOrUndefined } = require("../../utils")

const getAllGodsList  = async () => {
    const gods = await God.find({deleted: false});
    return { success: true, gods, count: gods.length };
};

const addGodDetails = async (req) => {

    let workDays = JSON.parse(req.body.worshipDay);
    const isValid = req && workDays && workDays.length > 0 && workDays.every(value => allowedWorshipDays.includes(value));

    if (isNullOrUndefined(req) || isNullOrUndefined(req.body.name) || !isValid) {
        const data = { success: false, message: "invalid request"};
        return {data, status: 400 };
    }

    const imagePath = PUBLIC_URL+'uploads/gods/'+req.file.filename;
    req.body.image = imagePath;

    await new God({
            name: req.body.name,
            image: req.body.image,
            worshipDay: workDays,
            createdAt: Date.now(),
            modifiedAt: Date.now()
    }).save();

    const data = { success: true, message: 'God details added successfully' };
    return { data, status: 200 };
  };

  const getGodDetailsById = async (req) => {
    const god = await God.findOne({ _id: req.params.id, deleted: false});

    if (!god) { 
        const data = { success: false, message: "God details doesn't exist"};
        return {data, status: 404 };
    } else {
        const data = { success: true, god};
        return {data, status: 200 };
    }
};

const updateGodDetails = async (req) => {
    const existingGod = await God.findOne({ _id: req.params.id, deleted: false});
   
    let workDays = JSON.parse(req.body.worshipDay);

    if (!existingGod) {
        const data = { success: false, message: "God details doesn't exist"};
        return {data, status: 404 };
    }

    if(isNullOrUndefined(req.file?.filename)){
        req.body.image = existingGod.image;
    } else {
        const imagePath = PUBLIC_URL+'uploads/gods/'+req?.file?.filename;
        req.body.image = imagePath;     
    }

    if(req.body?.name !== existingGod.name){
        req.body.name = existingGod.name;
    } else {
        req.body.name = req.body?.name;     
    }

    req.body.worshipDay = workDays;
    const result = await God.findByIdAndUpdate(req.params.id, 
        {$set: req.body},
        { runValidators: true, new: true });

        // update god details in services
        if (req.body && req.body.name && req.body.name !== null && existingGod.name !== req.body.name) {
            const query = {godId: req.params.id, deleted: false};
            await Service.updateMany(query, 
                {$set: {'godName': req.body.name}, 'modifiedAt': Date.now()});
        }
        //
        const data = { success: true,  message: "God details updated successfully", result};
        return {data, status: 200 };
};

const deleteGodDetails = async (req) => {
    const existingGod = await God.findOne({ _id: req.params.id, deleted: false});

    if (!existingGod) {
        const data = { success: false, message: "God details doesn't exist"};
        return {data, status: 404 };
    }

    await God.findByIdAndUpdate(req.params.id, 
        {$set: {'deleted': true}, 'modifiedAt': Date.now()});
         
        const query = {godId: req.params.id, deleted: false};
        await Service.updateMany(query, 
            {$set: {'deleted': true}, 'modifiedAt': Date.now()});

        const data = { success: true, message: "God details deleted successfully" };
        return {data, status: 200 };
};

module.exports = {
    getAllGodsList,
    addGodDetails,
    getGodDetailsById,
    updateGodDetails,
    deleteGodDetails
};
