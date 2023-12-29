const multer = require('multer');
const path = require('path');

// Set up a default folder
let defaultImageFolder = 'uploads/';

// Function to dynamically set Multer storage
const getStorage = (imageFolder) => {

   const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './'+imageFolder);
    },
    filename: function (req, file, cb) {
      if(imageFolder === 'uploads/services') {
        const extension = path.extname(file.originalname);
        let serviceName = req.body.serviceName.replace(/\s/g, '');
        const filename = `${req.body.godId}_${serviceName}${extension}`;
        cb(null, filename); 
      } else if("uploads/gods") {
        const extension = path.extname(file.originalname);
        let godName = req.body.name.replace(/\s/g, '');
        const filename = `${godName}${extension}`;
        cb(null, filename); 
      } else {
        cb(null, file.originalname); 
      }
    },
  });

  return storage;
};

// Common Multer upload function
const upload = (folder) => {
  return multer({ storage: getStorage(folder) });
};

module.exports = { upload };
