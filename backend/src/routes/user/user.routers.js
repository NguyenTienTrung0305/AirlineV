import express from 'express';
import { createUser, changePassword } from "../../controller/users/User.controller.js"

const router = express.Router();

router.post('/new', createUser)
router.post('/change-password', changePassword)

export default router