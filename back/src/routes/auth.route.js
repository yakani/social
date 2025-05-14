import {Router} from 'express';
import { redirectClient} from "../controllers/auth.controller.js";
import passport from 'passport';
import '../lib/google.js';
const router = Router();
router.get('/google',passport.authenticate('google'));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }), redirectClient);
  export default router;