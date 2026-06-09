import express from 'express';
import { processBankTransfer } from '../../controller/payment/Payment.controller.js';
const router = express.Router()

router.post('/process', processBankTransfer)

export default router