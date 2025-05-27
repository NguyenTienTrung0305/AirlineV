import express from 'express'
import { createNewFlight, getFlightSuggesion, getTypeSeats, lockSeat, searchFlightMock } from '../../controller/flights/Flight.controller.js'

const router = express.Router()
router.post('/new', createNewFlight)
router.get('/search', searchFlightMock)
router.get('/suggesion', getFlightSuggesion)
router.get('/typeSeat', getTypeSeats)
router.get('/lock-seat', lockSeat)

export default router