import express from 'express'
import { getUserProfileController, loginController, logoutController, registerController, updatePasswordController, updateProfileController, updateProfilePic } from '../controllers/userController.js'
import { isAuth } from '../middlewares/auth.js'
import { singleUpload } from '../middlewares/multer.js'

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

//updatePassword
router.put('/update-password', isAuth, updatePasswordController)

//updateProfilePic
router.put('/profile-picture', isAuth, singleUpload, updateProfilePic)

export default router
