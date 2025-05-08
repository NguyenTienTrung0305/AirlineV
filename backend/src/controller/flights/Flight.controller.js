import { dbCreateTypeSeats } from "../../services/flights/Flight.service"

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