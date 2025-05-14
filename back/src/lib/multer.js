import multer from 'multer';
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'video/mp4', 'video/quicktime', 'video/x-msvideo'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, JPG, PNG, GIF) and videos (MP4, MOV, AVI) are allowed.'));
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
        fileSize: 100*1024*1024// 3GB limit
  }
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'title', maxCount: 1 },
  { name: 'prompt', maxCount: 1 },
  { name: 'content', maxCount: 1 },
]);
export default upload