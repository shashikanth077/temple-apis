// Middleware to seed default roles
const Role = require('../models/auth/roleModel');
const { logger } = require("../middlewares");

const defaultRoles = [
    { name: 'superadmin' },
    { name: 'admin' },
    { name: 'user'},
];

async function seedDefaultRoles(req,res,next) {
    try {
        const existingRoles = await Role.find();
        if (existingRoles.length === 0) {
            await Role.insertMany(defaultRoles);
            console.log('Default roles seeded successfully.');
        }
        next();
    } catch (error) {
        logger.error("Error seeding default roles:", error);
    }
}

module.exports = seedDefaultRoles;
