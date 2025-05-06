import { admin, db } from "../../database/firebaseAdmin.js"
import crypto from 'crypto'

import { dbCreateUser, dbGetUserById } from "../../services/users/User.service.js"
import { dbCreateAdmin, dbGetAdminById } from "../../services/users/Admin.service.js"

const ROLES = {
    ADMIN: "admin",
    USER: "user",
}

const SESSION_EXPIRE_MS = 24 * 60 * 60 * 1000


const generateCSRFToken = () => {
    return crypto.randomBytes(32).toString('hex')
}


// khi người dùng nhập email và password, firebase SDK sẽ xác thực và trả về idToken, sau đó gửi idToken này cho firebase-admin ở backend dể xác thực
export const userLogin = async (req, res) => {
    const { idToken } = req.body
    try {
        const decodeToken = await admin.auth().verifyIdToken(idToken)
        const expiresIn = SESSION_EXPIRE_MS
        const userId = decodeToken.uid

        const sessionCookies = await admin.auth().createSessionCookie(idToken, { expiresIn })

        // CSRF token
        const csrfToken = generateCSRFToken()

        const userData = await dbGetUserById(userId)

        if (!userData) {
            return res.status(404).json({
                message: "Không tìm thấy User",
                code: "USER_NOT_FOUND"
            })
        }

        // lưu csrfToken sử dụng express-session để xác thực ở middleware
        req.session.userId = userId
        req.session.user = userData
        req.session.role = ROLES.USER
        req.session.csrfToken = csrfToken


        res.cookie("userSession", sessionCookies, {
            httpOnly: true, // cookie chỉ được truy cập từ phía server
            path: '/', // cookie được gửi khi truy cập các url bắt đầu bằng "/" => tức là toàn bộ trang web
            maxAge: expiresIn,
            secure: true,
            sameSite: 'strict',
        })

        res.cookie("userCsrfToken", csrfToken, {
            httpOnly: false, // cho phép frontend JavaScript đọc qua Cookies Header => để gửi csrfTokne trong request cho backend xác thực
            path: '/',
            maxAge: expiresIn,
            secure: true,
            sameSite: 'strict',
        })

        // Success without CSRF
        return res.status(200).json({
            user: userData,
            // csrfToken: csrfToken,
            message: "Đăng nhập thành công",
            code: "LOGIN_SUCCESS"
        })

    } catch (err) {
        return res.status(401).json({
            message: "Xác thực không thành công",
            code: "AUTH_FAILED"
        })
    }
}


export const adminLogin = async (req, res) => {
    const { idToken } = req.body
    try {
        const decoded = await admin.auth().verifyIdToken(idToken)
        const expiresIn = SESSION_EXPIRE_MS
        const uid = decoded.uid

        const adminData = await dbGetAdminById(uid)
        if (!adminData || adminData.role !== ROLES.ADMIN) {
            return res.status(403).json({
                message: "Tài khoản không tồn tại hoặc không có quyền admin",
                code: "UNAUTHORIZED_ADMIN"
            });
        }

        const sessionCokies = await admin.auth().createSessionCookie(idToken, { expiresIn })
        const csrfToken = generateCSRFToken()

        // Lưu thông tin admin và CSRF token vào express-session
        req.session.adminId = uid
        req.session.admin = adminData
        req.session.role = ROLES.ADMIN
        req.session.csrfToken = csrfToken

        res.cookie("adminSession", sessionCokies, {
            httpOnly: true,
            path: "/admin", // Cookie chỉ có hiệu lực cho các route /admin*
            maxAge: expiresIn,
            secure: true,
            sameSite: 'strict'
        })

        res.cookie("adminCsrfToken", csrfToken, {
            httpOnly: false,
            path: '/admin',
            maxAge: expiresIn,
            secure: true,
            sameSite: 'strict',
        })

        return res.status(200).json({
            admin: adminData,
            // csrfToken: csrfToken,
            message: "Đăng nhập Admin thành công",
            code: "ADMIN_LOGIN_SUCCESS"
        })
    } catch (error) {
        console.error("Lỗi verifyIdToken:", error)
        return res.status(401).json({
            message: "Xác thực admin thất bại",
            code: "ADMIN_AUTH_FAILED"
        })
    }
}


// Khi người dùng nhấn vào icon Google:
// Trình duyệt sẽ mở một popup Google Sign-In (hoặc chuyển hướng trang, tùy bạn dùng signInWithPopup hay signInWithRedirect)
// Người dùng chọn tài khoản Google
// Sau khi thành công, Firebase frontend SDK sẽ trả về thông tin user + idToken
// Bạn gửi idToken về backend để xác minh
export const googleLogin = async (req, res) => {
    const { idToken } = req.body

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        const uid = decodedToken.uid

        const userData = await dbGetUserById(uid)

        // Create refresh token
        const refreshToken = await admin.auth().createCustomToken(uid, {
            role: ROLES.USER,
            refreshOnly: true
        });

        // Set HTTP-only cookies
        res.cookie('sessionToken', idToken, COOKIE_CONFIG)
        res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_CONFIG)

        // Generate CSRF token if middleware is active
        if (req.csrfToken) {
            const csrfToken = req.csrfToken()

            return res.status(200).json({
                user: userData,
                csrfToken,
                message: "Đăng nhập Google thành công"
            })
        }

        return res.status(200).json({
            user: userData,
            message: "Đăng nhập Google thành công"
        });
    } catch (error) {
        return res.status(401).json({
            message: "Đăng nhập Google thất bại",
            code: "GOOGLE_AUTH_FAILED"
        })
    }
}

export const checkSession = async (req, res) => {
    const userCookieSession = req.cookies.userSession
    const adminCookieSession = req.cookies.adminSession

    if (userCookieSession) {
        try {
            const decodedClaims = await admin.auth().verifySessionCookie(userCookieSession)
            return res.status(200).json({ user: req.session.user })
        } catch (error) {
            return res.status(401).json({
                message: 'Phiên người dùng không hợp lệ',
                code: 'INVALID_USER_SESSION'
            })
        }
    } else if (adminCookieSession) {
        try {
            const decodedClaims = await admin.auth().verifySessionCookie(adminCookieSession);
            return res.status(200).json({ user: req.session.admin })
        } catch (error) {
            return res.status(401).json({
                message: 'Phiên admin không hợp lệ',
                code: 'INVALID_ADMIN_SESSION'
            })
        }
    } else {
        return res.status(401).json({
            message: 'Không tìm thấy phiên',
            code: 'NO_SESSION_COOKIE'
        })
    }
}


export const logout = async (req, res) => {
    res.clearCookie('userSession', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
    res.clearCookie('adminSession', { path: '/admin', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
    res.clearCookie('userCsrfToken', { path: '/', httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
    res.clearCookie('adminCsrfToken', { path: '/admin', httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
    es.clearCookie('connect.sid', { path: '/', httpOnly: true, sameSite: 'strict' })
    return res.status(200).json({
        message: 'Đăng xuất thành công'
    })
}
