import {Router} from 'express';
import protect from '../midlleware/token.verification.js';
import {createCOmment , getComments , deleteComment} from "../controllers/comments.controller.js"
import upload from '../lib/multer.js'
const router  = Router();
router.post('/:id',protect,upload,createCOmment);
router.get('/:id',getComments);
router.delete('/:id',protect,deleteComment);
export default router;