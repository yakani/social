import {Router} from 'express';
import protect from '../midlleware/token.verification.js';
import { GetfileObserve } from '../controllers/observe.controller.js';
import {createFile ,  getFileByuser, deleteFile, getAllFiles, getFileById, getFileByvisitor, CallbackResponse} from "../controllers/file.controller.js";
import upload from '../lib/multer.js';
const router = Router();
router.post('/',protect,upload, createFile);
router.get('/user',protect,getFileByuser);
router.get('/visitor/:id',protect,getFileByvisitor); // Assuming you want to get files by visitor ID
router.get('/',protect,getAllFiles);
router.delete('/:id',protect,deleteFile);
router.get('/:id',protect,getFileById); 
router.get('/observe/:id',protect,GetfileObserve);
router.get('/moderation',CallbackResponse);
export default router;