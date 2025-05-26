import express from 'express';
import { createAdmin } from '../../controller/users/Admin.controller.js';

const router = express.Router()

router.post('/new', createAdmin)

export default router;