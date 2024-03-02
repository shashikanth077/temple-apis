const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = (folder) => {
  return multer({ storage: getStorage(folder) });
};

// Function to dynamically set Multer storage
const getStorage = (imageFolder) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./" + imageFolder);
    },
    filename: function (req, file, cb) {
      if (imageFolder === "uploads/services") {
        const extension = path.extname(file.originalname);
        let serviceName = req.body.serviceName.replace(/\s/g, "").toLowerCase();
        const filename = `${req.body.godId}_${serviceName}${extension}`;
        cb(null, filename);
      } else if (imageFolder === "uploads/gods") {
        const extension = path.extname(file.originalname);
        let godName = req.body.name.replace(/\s/g, "").toLowerCase();
        const filename = `${godName}${extension}`;
        cb(null, filename);
      } else if (imageFolder === "uploads/staticfile") {
        const originalName = file.originalname;
        const filePath = path.join("uploads/staticfile", originalName);
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const newName = `${timestamp}_${originalName}`;
            fs.renameSync(filePath, path.join("uploads/staticfile", newName));
            cb(null, originalName);
          } else {
            cb(null, originalName);
          }
        });
      } else {
        cb(null, file.originalname);
      }
    },
  });

  return storage;
};

module.exports = { upload };
