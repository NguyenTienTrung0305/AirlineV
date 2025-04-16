import express from 'express'
import {
    login,
    adminLogin,
    googleLogin
} from '../../controller/login/index.js'


const router = express.Router()

router.post('/', login)
router.post('/admin', adminLogin)

export default router