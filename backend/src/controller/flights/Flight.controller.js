import { setCache } from "../../cache/cache.js"
import SeatType from "../../models/flights/FlightSeatType.model.js"
import { dbCreateFlight, dbCreateTypeSeats, dbGetTypeSeat, dbLockSeat, dbGetFlightSeats, dbGetAllTypeSeats, dbUnlockExpireSeat, dbUnlockSeat } from "../../services/flights/Flight.service.js"
import { generateFlightsSuggestion, generateMockFlights } from "../../services/flights/FlightGenerate.service.js"

export const createTypeSeats = async (req, res) => {
    try {
        const { typeCode, seatName, price, changeFee, refundFee, checkedBaggage, carryOn, service } = req.body
        const seatsData = { typeCode, seatName, price, changeFee, refundFee, checkedBaggage, carryOn, service }
        const isCreate = await dbCreateTypeSeats(seatsData)
        if (isCreate) {
            res.status(200).json({
                message: "Create type seats success",
                code: "CREATE_TYPE_SEATS_SUCCESS",
                data: seatsData
            })
        } else {
            res.status(400).json({
                message: "Create type seats failed",
                code: "CREATE_TYPE_SEATS_FAILED",
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            code: "INTERNAL_SERVER_ERROR" || error.message.code,
        })
    }
}

export const getTypeSeats = async (req, res) => {
    try {
        const { typeCode } = req.query
        const dataTypeSeat = await dbGetTypeSeat(typeCode)
        if (dataTypeSeat) {
            res.status(200).json({
                message: "Get Type Seat Success",
                code: "GTYPESEAT_SUCCESS",
                data: dataTypeSeat
            })
        } else {
            res.status(400).json({
                message: "Get Type Seat Failed",
                code: "GTYPESEAT_FAILED",
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Can not fetch to server",
            code: "INTERNAL_SERVER_ERROR" || error.message.code,
        })
    }
}


export const createNewFlight = async (req, res) => {
    try {
        const { flightData, rows, cols, seatTypes, startRowBus, startRowEco, standardPrice } = req.body
        if (!flightData || !rows || !cols || !seatTypes || !startRowBus || !startRowEco || !standardPrice) {
            return res.status(400).json({
                message: 'Missing required fields',
                code: 'MISSING_REQUIRED_FIELDS'
            })
        }

        const isCreate = await dbCreateFlight(flightData, rows, cols, seatTypes, startRowBus, startRowEco, standardPrice)
        if (isCreate) {
            res.status(200).json({
                message: "Create flight successfully",
                code: "CREATE_FLIGHT_SUCCESS",
            })
        } else {
            res.status(400).json({
                message: "Create flight failed",
                code: "CREATE_FLIGHT_FAILED",
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            code: "INTERNAL_SERVER_ERROR" || error.message.code,
        })
    }
}


export const searchFlightMock = async (req, res) => {
    try {
        const { departureCity, arrivalCity, flightDate } = req.query
        const flightsAndSeats = generateMockFlights(departureCity, arrivalCity)
        const creationStatus = await Promise.all(
            flightsAndSeats.map(async (flightSeat) => {
                const { flight, rows, cols, seatType, startRowBus, startRowEco, standardPrice } = flightSeat
                return await dbCreateFlight(flight, rows, cols, seatType, startRowBus, startRowEco, standardPrice)
            })
        )

        // Lấy tất cả seatTypes
        const seatTypes = await dbGetAllTypeSeats()

        // Lấy danh sách ghế cho mỗi chuyến bay
        const flightsWithSeats = await Promise.all(
            flightsAndSeats.map(async (flightSeat) => {
                const seats = await dbGetFlightSeats(flightSeat.flight.flightId);
                return { ...flightSeat, seats }
            })
        )

        const allCreatedSuccessfully = creationStatus.every((status) => status === true)
        if (allCreatedSuccessfully) {
            res.status(200).json({
                message: "Flights fetched and created successfully",
                code: "FETCHED_FLIGHT_SUCCESS",
                data: {
                    flights: flightsWithSeats,
                    seatTypes
                }

            })
        } else {
            res.status(500).json({ // Hoặc mã lỗi phù hợp hơn
                message: "Failed to create one or more flights",
                code: "CREATE_FETCHED_FLIGHT_FAILED",
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Flights fetched failed",
            code: "FETCHED_FLIGHT_FAILED",
            error: error.message
        })
    }
}

export const searchFlight = async (req, res) => {
    try {
        const { departureCity, arrivalCity, flightDate } = req.query
        // search service
    } catch (error) {

    }
}


export const getFlightSuggesion = async (req, res) => {
    try {
        const flights = generateFlightsSuggestion()
        const createStatus = await Promise.all(
            flights.flat().map(async (flightSeat) => {
                const { flight, rows, cols, seatType, startRowBus, startRowEco, standardPrice } = flightSeat
                return await dbCreateFlight(flight, rows, cols, seatType, startRowBus, startRowEco, standardPrice)
            })
        )


        // Lấy tất cả seatTypes
        const seatTypes = await dbGetAllTypeSeats()

        // Lấy danh sách ghế cho mỗi chuyến bay
        const flightsWithSeats = await Promise.all(
            flights.flat().map(async (flightSeat) => {
                const seats = await dbGetFlightSeats(flightSeat.flight.flightId)
                return { ...flightSeat, seats }
            })
        )

        const allCreatedSuccessfully = createStatus.every((status) => status === true)
        if (allCreatedSuccessfully) {
            res.status(200).json({
                message: "Flights suggesion successfully",
                code: "FLIGHT_SUGGESION_SUCCESS",
                data: {
                    flights: flightsWithSeats,
                    seatTypes
                }
            })
        } else {
            res.status(500).json({
                message: "Failed to fetch suggesion flights",
                code: "FLIGHT_SUGGESION_FAILED",
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Flights fetched failed",
            code: "FETCHED_FLIGHT_FAILED",
            error: error.message
        })
    }
}

export const lockSeat = async (req, res) => {
    try {
        const { flightId, seatCode, userId, durationMs } = req.body

        if (!flightId || !seatCode || !userId || !durationMs) {
            return res.status(400).json({
                message: 'Thiếu các trường bắt buộc',
                code: 'MISSING_REQUIRED_FIELDS',
            })
        }

        const success = await dbLockSeat(flightId, seatCode, userId, durationMs)

        if (success) {
            return res.status(200).json({
                message: 'Ghế đã được khóa thành công',
                code: 'LOCK_SEAT_SUCCESS',
            })
        } else {
            return res.status(400).json({
                message: 'Không thể khóa ghế',
                code: 'LOCK_SEAT_FAILED',
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi máy chủ nội bộ',
            code: 'INTERNAL_SERVER_ERROR',
            error: error.message,
        })
    }
}


export const unlockExpireSeat = async (req, res) => {
    try {
        const { flightId } = req.body
        if (!flightId) {
            return res.status(400).json({
                message: 'Thiếu flightId',
                code: 'MISSING_REQUIRED_FIELDS',
            })
        } else {
            const success = await dbUnlockExpireSeat(flightId)
            if (success) {
                return res.status(200).json({
                    message: 'Ghế đã được mở thành công',
                    code: 'UNLOCK_SEAT_SUCCESS',
                })
            } else {
                return res.status(400).json({
                    message: 'Không thể mở khóa ghế',
                    code: 'UNLOCK_SEAT_FAILED',
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi máy chủ nội bộ',
            code: 'INTERNAL_SERVER_ERROR',
            error: error.message,
        })
    }
}

export const unlockSeat = async (req, res) => {
    try {
        const { flightId, seatCode, userId } = req.body
        if (!flightId || !seatCode || !userId) {
            return res.status(400).json({
                message: "Mising field requirement",
                code: "MISSING_REQUIRED_FIELDS",
            })
        }

        const success = await dbUnlockSeat(flightId, seatCode, userId)
        if (success) {
            return res.status(200).json({
                message: "Seat unlocked successfully",
                code: "UNLOCK_SEAT_SUCCESS",
            })
        } else {
            return res.status(400).json({
                message: "Failed to unlock seat",
                code: "UNLOCK_SEAT_FAILED",
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            code: "INTERNAL_SERVER_ERROR",
            error: error.message,
        })
    }
}