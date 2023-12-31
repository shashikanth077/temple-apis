const multer = require('multer');
const path = require('path');

// Set up a default folder
let defaultImageFolder = 'uploads/';

const upload = (folder) => {
  return multer({ storage: getStorage(folder) });
};

// Function to dynamically set Multer storage
const getStorage = (imageFolder) => {

   const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './'+imageFolder);
    },
    filename: function (req, file, cb) {
      if(imageFolder === 'uploads/services') {
          const extension = path.extname(file.originalname);
          let serviceName = req.body.serviceName.replace(/\s/g, '').toLowerCase();;
          const filename = `${req.body.godId}_${serviceName}${extension}`;
        cb(null, filename); 
      } else if(imageFolder ===  "uploads/gods") {
          const extension = path.extname(file.originalname);
          let godName = req.body.name.replace(/\s/g, '').toLowerCase();;
          const filename = `${godName}${extension}`;
          cb(null, filename); 
      } else if(imageFolder ===  "uploads/products") {
          // const extension = path.extname(file.originalname);
          // let productName = req.body.name.replace(/\s/g, '').toLowerCase();
          // const filename = `${productName}${extension}`;
          // cb(null, filename); 
          cb(null, file.originalname); 
      } else {
        cb(null, file.originalname); 
      }
    },
  });

  return storage;
};


module.exports = { upload };
