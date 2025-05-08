import express from 'express'
import { createNewFlight } from '../../controller/flights/Flight.controller'

const router = express.Router()
router.post('/new', createNewFlight)

export default router