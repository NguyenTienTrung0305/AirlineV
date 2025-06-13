import { getCache, userCache } from "../../cache/cache.js"
import { dbUpdateAdmin } from "../../services/users/Admin.service.js"
import { dbUpdateUser } from "../../services/users/User.service.js"

export const updateAccountInfo = async (req, res) => {
    try {
        const role = req.session.role
        const { uid, updatedInfo } = req.body

        if (role === 'user') {
            const isUpdateUser = await dbUpdateUser(uid, updatedInfo)
            if (isUpdateUser) {

                const cachedUser = getCache(userCache, uid)
                if (cachedUser) {
                    const updatedUser = { ...cachedUser, ...updatedInfo }
                    userCache.set(uid, updatedUser)
                }


                return res.status(200).json({
                    message: 'Update user successfully',
                    data: updatedInfo,
                    code: 'UPDATE_SUCCESS'
                })
            } else {
                return res.status(401).json({
                    message: 'Update user failed',
                    code: 'UPDATE_FAILED'
                })
            }
        } else if (role === 'admin') {
            const isUpdateAdmin = await dbUpdateAdmin(uid, updatedInfo)
            if (isUpdateAdmin) {

                const cachedAdmin = getCache(userCache, uid)
                if (cachedAdmin) {
                    const updatedAdmin = { ...cachedAdmin, ...updatedInfo }
                    userCache.set(uid, updatedAdmin)
                }

                return res.status(200).json({
                    message: 'Update admin successfully',
                    data: updatedInfo,
                    code: 'UPDATE_SUCCESS'
                })
            } else {
                return res.status(401).json({
                    message: 'Update admni failed',
                    code: 'UPDATE_FAILED'
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            code: 'SERVER_ERROR'
        })
    }
}