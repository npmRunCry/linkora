import multer from "multer";

const storage = multer.memoryStorage()

function fileFilter(req, file, callback){
    if(file.mimetype.startsWith("image/")){
        callback(null, true)
    }else{
        callback(new Error("Only image files are allowed"), false)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024},
})