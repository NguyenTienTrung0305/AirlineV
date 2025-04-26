import {
    dbCreateUser
} from "../../services/users/User.service.js"

import {
    getCache,
    setCache,
    deleteCache,
    userCache
} from "../../cache/cache.js"

export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const newUser = await dbCreateUser({
            firstName, lastName, email, password
        })
        // thêm newUser theo uid của nó
        userCache.set(newUser.uid, newUser)

        // thêm newUser vào cache users (danh sách tất cả users)
        const cacheAllUser = getCache(userCache, "users")
        if (cacheAllUser) {
            cacheAllUser.push(newUser)
            setCache(userCache, "users", cacheAllUser)
        }
        else {
            setCache(userCache, "users", [newUser])
        }

        res.status(200).send({
            message: "User created successfully"
        })
    }
    catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}