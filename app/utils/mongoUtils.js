const { ObjectId } = require("mongodb");

const convertStringToObjectId = (str) => {
  try {
    return new ObjectId(str);
  } catch (error) {
    // Handle invalid ObjectId
    console.error("Invalid ObjectId:", error.message);
    return null;
  }
}

module.exports = { convertStringToObjectId };
