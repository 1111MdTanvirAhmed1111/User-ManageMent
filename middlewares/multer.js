const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
 
      cb(null,  Date.now() + '-' + file.originalname.split(" ").join("") )
    }
  })
const uploadSingle = (file) => multer({ storage: storage }).single(file)




  module.exports = {uploadSingle}