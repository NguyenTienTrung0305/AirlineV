import express from "express"
import { createTypeSeats } from '../../controller/flights/Flight.controller.js'

const router = express.Router()
router.post("/new", createTypeSeats)

export default router