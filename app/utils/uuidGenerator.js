const uuid = require('uuid');

const generateUniqueKey =() => {
  return uuid.v4();
}

module.exports = {
    generateUniqueKey
}
