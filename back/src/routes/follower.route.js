import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/follower.controller.js';
import protect from '../midlleware/token.verification.js';
const router = express.Router();

router.post('/follow', protect, followUser);
router.delete('/unfollow', protect, unfollowUser);
router.get('/followers', protect, getFollowers);
router.get('/following', protect, getFollowing);

export default router;
