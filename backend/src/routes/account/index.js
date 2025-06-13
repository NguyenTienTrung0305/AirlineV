import express from 'express';
import { updateAccountInfo } from '../../controller/account/Account.controller.js';
const router = express.Router();

router.post("/update", updateAccountInfo)

export default router;
