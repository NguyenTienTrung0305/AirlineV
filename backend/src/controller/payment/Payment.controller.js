import { dbGetTransactionHistory, dbGetUserById, dbUpdateUser } from "../../services/users/User.service.js"

export const processBankTransfer = async (req, res) => {
    try {
        const { userUid, flightId, passengers, amount, paymentMethod, paymentDetails, transactionId } = req.body
        const user = await dbGetUserById(userUid)
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                code: 'USER_NOT_FOUND'
            })
        }

        const newUser = { ...user, bookingHistory: [...user.bookingHistory, transactionId] }
        const isUpdatedUser = await dbUpdateUser(userUid, newUser)

        if (!isUpdatedUser) {
            return res.status(500).json({
                message: 'Failed to update user booking history',
                code: 'UPDATE_USER_FAILED'
            })
        }

        return res.status(200).json({
            message: 'Bank transfer processed successfully',
            code: 'BANK_TRANSFER_SUCCESS'
        })

    } catch (error) {
        console.error('Error processing bank transfer:', error)
        res.status(500).json({
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const verifyPayment = async (req, res) => {
    const { transactionId } = req.query
    try {
        // Simulate payment verification logic
        // In a real application, you would check the transaction status from your payment gateway
        // Here you would typically call your payment gateway API to verify the transaction
        // For this example, we assume the verification is successful
        if (!transactionId) {
            return res.status(400).json({
                message: "transactionId is required",
                code: "MISSING_TRANSACTION_ID"
            })
        }

        const bookingHistory = await dbGetTransactionHistory(transactionId.split('_')[1])
        if (!bookingHistory || bookingHistory.length === 0) {
            return res.status(404).json({
                message: "Transaction not found",
                code: "TRANSACTION_NOT_FOUND"
            })
        }

        const isVerified = bookingHistory.some(transaction => transaction.transactionId === transactionId)
        if (isVerified) {
            return res.status(200).json({
                message: "Payment verified successfully",
                code: "PAYMENT_VERIFIED"
            })
        } else {
            return res.status(404).json({
                message: "payment verification failed",
                code: "PAYMENT_VERIFICATION_FAILED"
            })
        }
    }
    catch (error) {
        console.error('Error verifying payment:', error)
        res.status(500).json({
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR'
        })
    }
}