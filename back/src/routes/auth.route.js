import {Router} from 'express';
import { googleTokenAuth, redirectClient, SignupToken} from "../controllers/auth.controller.js";
import passport from 'passport';
import '../lib/google.js';
const router = Router();
router.get('/google',passport.authenticate('google'));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }), redirectClient);
  router.post('/google/callback/login',googleTokenAuth);
  router.post('/google/callback/signup',SignupToken);
  export default router;