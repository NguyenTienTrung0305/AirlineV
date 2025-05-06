import express from 'express';
import { createAdmin } from '../../controller/users/Admin.controller';
import { checkRole } from '../../middleware/auth.middleware';

const router = express.Router()

router.post('/new', createAdmin)

export default router;