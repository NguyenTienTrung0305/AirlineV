import express from 'express';
import { createUser } from "../../controller/users/User.controller.js"

const router = express.Router();

router.post('/new', createUser)

export default router