import { dbCreateAdmin } from "../../services/users/Admin.service.js"
import {
    getCache,
    setCache,
    deleteCache,
    userCache
} from "../../cache/cache.js"

export const createAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const newAdmin = await dbCreateAdmin({ firstName, lastName, email, password })

        userCache.set(newAdmin.uid, newAdmin)

        const cacheAllAdmin = getCache(userCache, 'admins')
        if (cacheAllAdmin) {
            cacheAllAdmin.push(newAdmin)
            setCache(userCache, 'admins', cacheAllAdmin)
        } else {
            setCache(userCache, 'admins', [newAdmin])
        }
        res.status(200).send({
            message: "Admin created successfully"
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}