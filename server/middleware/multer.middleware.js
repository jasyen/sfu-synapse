const multer = require('multer')


// File upload middleware
const defStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/uploads')
    },
    filename: function(req, file, cb) {
        const username = req.params.username
        cb(null, username + '-' + Date.now() + '-' + file.originalname)
    }
})

const upload = multer({storage: defStorage}).single('file')

module.exports = { upload }