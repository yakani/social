import {Router} from 'express';
import protect from '../midlleware/token.verification.js';
import { GetfileObserve } from '../controllers/observe.controller.js';
import {createFile ,  getFileByuser, deleteFile, getAllFiles, getFileById, getFileByvisitor, CallbackResponse} from "../controllers/file.controller.js";
import upload from '../lib/multer.js';
const router = Router();
router.post('/',protect,upload, createFile);
router.post('/moderation',CallbackResponse);
router.get('/user',protect,getFileByuser);
router.get('/visitor/:id',protect,getFileByvisitor); // Assuming you want to get files by visitor ID
router.get('/',protect,getAllFiles);
router.get('/:id',protect,getFileById); 
router.get('/observe/:id',protect,GetfileObserve);
router.delete('/:id',protect,deleteFile);

export default router;