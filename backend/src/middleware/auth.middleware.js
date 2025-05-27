import NodeCache from "node-cache"
import { admin, db } from "../database/firebaseAdmin.js"
import { getCache, userCache } from "../cache/cache.js"
import crypto from 'crypto'

const USER_COLLECTION_NAME = "users"
const ADMIN_COLLECTION_NAME = "admins"

const SESSION_COOKIE_USER = 'userSession'
const CSRF_COOKIE_USER = 'userCsrfToken'

const SESSION_COOKIE_ADMIN = 'adminSession'
const CSRF_COOKIE_ADMIN = 'adminCsrfToken'

const generateCSRFToken = () => {
    return crypto.randomBytes(32).toString('hex')
}

export const verifySessionAndCSRF = async (req, res, next) => {
    const sessionCookie = req.cookies[SESSION_COOKIE_USER] || req.cookies[SESSION_COOKIE_ADMIN]
    const csrfTokenClient = req.cookies['x-csrf-token'] || req.body.csrfToken || req.cookies[CSRF_COOKIE_USER] || req.cookies[CSRF_COOKIE_ADMIN]

    if (!sessionCookie) {
        return res.status(403).json({
            message: 'Thiếu session cookie',
            code: 'SESSION_MISSING'
        })
    }

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
        const userId = decodedClaims.uid

        let userData = getCache(userCache, userId)
        let role

        if (!userData) {
            const isAdminSession = !!req.cookies[SESSION_COOKIE_ADMIN]
            const userCollectionName = isAdminSession ? ADMIN_COLLECTION_NAME : USER_COLLECTION_NAME
            const userDocRef = db.collection(userCollectionName).doc(userId)
            const userDoc = await userDocRef.get()

            if (!userDoc.exists) {
                return res.status(401).json({
                    message: "Không tìm thấy user hoặc admin",
                    code: "USER_OR_ADMIN_NOT_FOUND"
                })
            }
            userData = { uid: userId, ...userDoc.data() }
            userCache.set(userId, userData)
            role = isAdminSession ? 'admin' : 'user'
        } else {
            role = req.session?.role;
            if (!role) {
                role = !!req.cookies[SESSION_COOKIE_ADMIN] ? 'admin' : 'user'
            }
        }

        // Kiểm tra CSRF token (chỉ khi có token client)
        if (csrfTokenClient) {
            if (csrfTokenClient !== req.session?.csrfToken) {
                return res.status(403).json({
                    message: 'CSRF token không hợp lệ',
                    code: 'CSRF_INVALID'
                })
            }

            // **Tạo CSRF token mới **
            const newCsrfToken = generateCSRFToken()
            req.session.csrfToken = newCsrfToken
            const csrfCookieName = role === 'admin' ? CSRF_COOKIE_ADMIN : CSRF_COOKIE_USER
            const csrfCookiePath = role === 'admin' ? '/admin' : '/'
            res.cookie(csrfCookieName, newCsrfToken, {
                httpOnly: false,
                path: csrfCookiePath,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            })
        } else if (req.method !== 'GET') {
            return res.status(403).json({
                message: 'Thiếu CSRF token',
                code: 'CSRF_MISSING_ON_MUTATION'
            })
        }

        req.user = userData
        next()

    } catch (error) {
        return res.status(401).json({
            message: 'Phiên đăng nhập không hợp lệ',
            code: 'INVALID_SESSION'
        })
    }
}

export const isAdminRoute = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
        return next()
    }
    return res.status(403).json({
        message: 'Không có quyền truy cập admin',
        code: 'UNAUTHORIZED_ADMIN'
    })
}

export const isUserRoute = (req, res, next) => {
    if (req.session && req.session.role === 'user') {
        return next()
    }
    return res.status(403).json({
        message: 'Không có quyền truy cập',
        code: 'UNAUTHORIZED'
    })
}