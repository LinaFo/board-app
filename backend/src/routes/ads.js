// backend/src/routes/ads.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import { 
  getAds, getAd, createAd, updateAd, deleteAd, getMyAds, 
  likeAd, getAdLikes, getLikedAds 
} from '../controllers/adController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Только JPEG, PNG, JPG'));
    }
  }
});

router.get('/', getAds);
router.get('/me', auth, getMyAds);
router.get('/liked', auth, getLikedAds);
router.get('/:id', getAd);
router.get('/:adId/likes', getAdLikes);
router.post('/', auth, upload.single('image'), createAd);
router.post('/like', auth, likeAd);
router.put('/:id', auth, updateAd);
router.delete('/:id', auth, deleteAd);

export default router;