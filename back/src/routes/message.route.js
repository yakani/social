import {Router} from 'express';
import protect from '../midlleware/token.verification.js';
import upload from '../lib/multer.js';
import  { createMessage ,  deleteMessage, getMessages} from '../controllers/message.controller.js';
const router = Router();
router.post('/:id',protect, upload,createMessage);
router.get('/:id',protect,getMessages);
router.delete('/:id',protect,deleteMessage);
export default router;