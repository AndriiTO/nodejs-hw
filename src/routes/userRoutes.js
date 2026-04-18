import { Router } from 'express';
import { updateUserAvatar } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
// import { celebrate } from 'celebrate';
// import { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema } from '../validations/authValidation.js';
// import { registerUser, loginUser, logoutUser , refreshUserSession, resetPassword } from '../controllers/authController.js';




const router = Router();

router.patch('/users/me/avatar' , authenticate , upload.single('avatar'), updateUserAvatar);

export default router;
