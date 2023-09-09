const multer = require("multer");

const storage = multer.memoryStorage();

const uploadFile = multer({ storage: storage });

exports.uploadFile = uploadFile;
