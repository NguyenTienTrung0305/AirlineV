import NodeCache from "node-cache"
import admin from "../database/firebaseAdmin.js"

import { getCache, userCache } from "../cache/cache.js"
import { doc, getDoc, getFirestore } from "firebase/firestore";

const USER_COLLECTION_NAME = "customers";
const ADMIN_COLLECTION_NAME = "admins";

export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const token = authHeader.split(" ")[1]


    const isAdmin = req.headers["admin"] === "true"
    const userCollectionName = isAdmin ? ADMIN_COLLECTION_NAME : USER_COLLECTION_NAME

    try {
        const decoded = await admin.auth().verifyIdToken(token)
        const userId = decoded.uid

        const cacheUser = getCache(userCache, userId)
        if (cacheUser) {
            req.user = cacheUser
            return next()
        }

        const userDocRef = doc(getFirestore(), userCollectionName, userId)
        const userDoc = await getDoc(userDocRef)
        if (!userDoc.exists()) {
            return res.status(401).json({ message: "User not found" })
        }

        const userData = { uid: userId, ...userDoc.data() }
        userCache.set(userId, userData)
        req.user = userData

        next()
    } catch {
        return res.status(401).json({ message: "Invalid token" })
    }
}


export const requireAuthWithoutCache = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const token = authHeader.split(" ")[1]
    const isAdmin = req.headers["admin"] === "true"
    const userCollectionName = isAdmin ? ADMIN_COLLECTION_NAME : USER_COLLECTION_NAME

    try {
        const decoded = await admin.auth().verifyIdToken(token)
        const userId = decoded.uid

        const userDocRef = doc(getFirestore(), userCollectionName, userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            return res.status(404).send({
                message: "User not found",
            });
        }

        req.user = { uid: userId, ...userDoc.data() };

        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}


export const checkRole = (req, res, next) => {
    try {
        const user = req.user
        if (user.role !== "admin") {
            return res.status(403).json({ message: "You do not have permission to perform this action" })
        }
        next()
    }
    catch (error) {
        return res.status(400).json({ message: error.message })
    }
}