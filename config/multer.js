const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join(__dirname, '../public/images');

// Ensure directory exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(12).toString('hex') + path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

module.exports = { upload };