import express from 'express'
import {
    userLogin,
    adminLogin,
    googleLogin
} from '../../controller/auth/index.js'


const router = express.Router()

router.post('/user', userLogin)
router.post('/admin', adminLogin)

export default router