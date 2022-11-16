import express from 'express';
import {login,createUser, bulkImport } from '../controllers/auth.js';
import authentication from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    /*Appending extension with original name*/
    cb(null, file.originalname) 
  }
})

var upload = multer({ storage: storage });

const router = express.Router();

router.post('/login/', login);
router.post('/signup', authentication ,createUser);
router.post('/bulk-import', upload.single('file') ,bulkImport);

export default router;