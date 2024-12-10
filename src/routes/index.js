import express from 'express';
import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';
import addressRouter from './addressRoutes.js';
import categoryRouter from './categoryRoutes.js';
import brandRouter from './brandRoutes.js';
import productRouter from './productRoutes.js';
import cartRouter from './cartRoutes.js';
import wishlistRouter from './wishlistRoutes.js';
import couponRouter from './couponRoutes.js';
import orderRouter from './orderRoutes.js';
import reviewRouter from './reviewRoutes.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use(userRouter);
router.use(addressRouter);
router.use(categoryRouter);
router.use(brandRouter);
router.use(productRouter);
router.use(cartRouter);
router.use(wishlistRouter);
router.use(couponRouter);
router.use(orderRouter);
router.use(reviewRouter);

export default router;
