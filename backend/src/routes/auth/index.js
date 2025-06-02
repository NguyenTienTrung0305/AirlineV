import express from "express";
import { checkSession, logout } from '../../controller/auth/index.js'

const router = express.Router()

router.get('/session', checkSession)
router.post('/logout', logout)

export default router

