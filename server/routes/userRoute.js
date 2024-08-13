import express from 'express'
import { getUserProfileController, loginController, logoutController, registerController, updateProfileController } from '../controllers/userController.js'
import { isAuth } from '../middlewares/auth.js'

const router = express.Router()

//register
router.post('/register', registerController)

//login
router.post('/login', loginController)

//profile
router.get('/profile', isAuth, getUserProfileController)

//logout
router.get('/logout', isAuth, logoutController)

//updateProfile
router.put('/profile-update', isAuth, updateProfileController)

export default router
