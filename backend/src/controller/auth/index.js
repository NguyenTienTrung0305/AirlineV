import { auth, db } from "../../database/firebaseAdmin.js"
import { Timestamp } from "firebase-admin/firestore"
import crypto from 'crypto'

import { dbGetUserById, dbCreateUserFromGoogle } from "../../services/users/User.service.js"
import { dbGetAdminById } from "../../services/users/Admin.service.js"
import { getCache, userCache } from "../../cache/cache.js"


const ROLES = {
    ADMIN: "admin",
    USER: "user",
}

const USER_COLLECTION_NAME = "users"
const ADMIN_COLLECTION_NAME = "admins"

const SESSION_EXPIRE_MS = 24 * 60 * 60 * 1000


const generateCSRFToken = () => {
    return crypto.randomBytes(32).toString('hex')
}


// khi người dùng nhập email và password, firebase SDK sẽ xác thực và trả về idToken, sau đó gửi idToken này cho firebase-admin ở backend dể xác thực
export const userLogin = async (req, res) => {
    const { idToken } = req.body
    try {
        const decodeToken = await auth.verifyIdToken(idToken)
        const expiresIn = SESSION_EXPIRE_MS
        const userId = decodeToken.uid

        const sessionCookies = await auth.createSessionCookie(idToken, { expiresIn })

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
            path: '/', // cookie được gửi khi truy cập các url bắt đầu bằng "/" (đường dẫn ở frontend) => tức là toàn bộ trang web
            maxAge: expiresIn,
            secure: true, // Đảm bảo cookie chỉ được gửi qua HTTPS không gửi được qua HTTP
            sameSite: 'strict', // cookie chỉ được gửi trong các yêu cầu có cùng protocal, domain và port, tức là nhấp vào liên kết ra trang web bên ngoài cookie sẽ không được gửi
        })

        res.cookie("userCsrfToken", csrfToken, {
            httpOnly: false, // cho phép frontend JavaScript đọc qua document.cookie => để gửi csrfTokne trong request cho backend xác thực
            path: '/',
            maxAge: expiresIn,
            secure: true,
            sameSite: 'strict',
        })

        // Success without CSRF
        return res.status(200).json({
            user: userData,
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
        const decoded = await auth.verifyIdToken(idToken)
        const expiresIn = SESSION_EXPIRE_MS
        const uid = decoded.uid

        const adminData = await dbGetAdminById(uid)
        if (!adminData || adminData.role !== ROLES.ADMIN) {
            return res.status(403).json({
                message: "Tài khoản không tồn tại hoặc không có quyền admin",
                code: "UNAUTHORIZED_ADMIN"
            });
        }

        const sessionCokies = await auth.createSessionCookie(idToken, { expiresIn })
        const csrfToken = generateCSRFToken()

        // Lưu thông tin admin và CSRF token vào express-session
        req.session.adminId = uid
        req.session.admin = adminData
        req.session.role = ROLES.ADMIN
        req.session.csrfToken = csrfToken

        res.cookie("adminSession", sessionCokies, {
            httpOnly: true,
            path: "/admin", // Cookie chỉ có hiệu lực cho các route /admin* (đường dẫn ở frontend)
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
        const decodedToken = await auth.verifyIdToken(idToken)

        const uid = decodedToken.user_id || decodedToken.uid
        const email = decodedToken.email
        const name = decodedToken.name || decodedToken.display_name
        const expiresIn = SESSION_EXPIRE_MS

        // create session cookie
        const sessionCookies = await auth.createSessionCookie(idToken, { expiresIn })
        const csrfToken = generateCSRFToken()

        let userData = await dbGetUserById(uid)
        if (!userData) {
            let firstName = ''
            let lastName = ''
            console.log(name)
            if (name) {
                firstName = name.trim().split(' ')[0] || ''
                lastName = name.trim().split(' ').slice(1).join(' ') || ''
            } else {
                firstName = email.split('@')[0];
                lastName = ''
            }

            const newUserData = {
                uid: uid,
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: ROLES.USER,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            }
            userData = await dbCreateUserFromGoogle(uid, newUserData)
            if (!userData) {
                return res.status(400).json({
                    message: "Tạo tài khoản thất bại",
                    code: "USER_CREATION_FAILED"
                })
            }
        } else {
            // update info if info is changed on gooogle
            const updateData = {}
            if (name) {
                const nameParts = name.trim().split(' ')
                const newFirstName = nameParts[0] || ''
                const newLastName = nameParts.slice(1).join(' ') || ''

                if (newFirstName !== userData.firstName) {
                    updateData.firstName = newFirstName
                }
                if (newLastName !== userData.lastName) {
                    updateData.lastName = newLastName
                }

                if (Object.keys(updateData).length > 0) {
                    updateData.updatedAt = Timestamp.now()
                    await db.collection(USER_COLLECTION_NAME).doc(uid).update(updateData)
                    userData = { ...userData, ...updateData }
                }
            }
        }

        // store infomation user into express-session
        req.session.userId = uid
        req.session.user = userData
        req.session.role = ROLES.USER
        req.session.csrfToken = csrfToken

        res.cookie('userSession', sessionCookies, {
            httpOnly: true,
            path: '/',
            maxAge: expiresIn,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict'
        })


        res.cookie('userCsrfToken', csrfToken, {
            httpOnly: false,
            path: '/',
            maxAge: expiresIn,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict'
        })

        return res.status(200).json({
            user: userData,
            message: "Đăng nhập thành công",
            code: "LOGIN_SUCCESS"
        })
    } catch (error) {
        console.error("Error in googleLogin:", error)
        return res.status(401).json({
            message: "Đăng nhập Google thất bại",
            code: "GOOGLE_AUTH_FAILED"
        })
    }
}

// export const checkSession = async (req, res) => {
//     const userCookieSession = req.cookies.userSession
//     const adminCookieSession = req.cookies.adminSession

//     if (userCookieSession) {
//         try {
//             const decodedClaims = await admin.auth().verifySessionCookie(userCookieSession)
//             return res.status(200).json({ user: req.session.user })
//         } catch (error) {
//             return res.status(401).json({
//                 message: 'Phiên người dùng không hợp lệ',
//                 code: 'INVALID_USER_SESSION'
//             })
//         }
//     } else if (adminCookieSession) {
//         try {
//             const decodedClaims = await admin.auth().verifySessionCookie(adminCookieSession);
//             return res.status(200).json({ user: req.session.admin })
//         } catch (error) {
//             return res.status(401).json({
//                 message: 'Phiên admin không hợp lệ',
//                 code: 'INVALID_ADMIN_SESSION'
//             })
//         }
//     } else {
//         return res.status(401).json({
//             message: 'Không tìm thấy phiên',
//             code: 'NO_SESSION_COOKIE'
//         })
//     }
// }

export const checkSession = async (req, res) => {

    const userCookieSession = req.cookies.userSession
    const adminCookieSession = req.cookies.adminSession

    let userId
    let role

    if (userCookieSession) {

        try {
            const decodedClaims = await auth.verifySessionCookie(userCookieSession)
            userId = decodedClaims.uid
            role = 'user'
            req.session.csrfToken = req.cookies.userCsrfToken
        } catch (error) {
            return res.status(401).json({
                message: 'Phiên người dùng không hợp lệ',
                code: 'INVALID_USER_SESSION'
            })
        }
    } else if (adminCookieSession) {
        try {
            const decodedClaims = await auth.verifySessionCookie(adminCookieSession)
            userId = decodedClaims.uid
            role = 'admin'
            req.session.csrfToken = req.cookies.adminCsrfToken
        } catch (error) {
            return res.status(401).json({
                message: 'Phiên admin không hợp lệ',
                code: 'INVALID_ADMIN_SESSION'
            })
        }
    }

    if (userId) {

        let userData = getCache(userCache, userId)
        if (!userData) {
            const userCollectionName = role === 'admin' ? ADMIN_COLLECTION_NAME : USER_COLLECTION_NAME
            const userDocRef = db.collection(userCollectionName).doc(userId)
            const userDoc = await userDocRef.get()
            if (userDoc.exists) {
                userData = { uid: userId, ...userDoc.data() }
                userCache.set(userId, userData)
            }
        }

        if (userData) {
            req.session.userId = userId
            req.session.user = role === 'user' ? userData : undefined
            req.session.admin = role === 'admin' ? userData : undefined
            req.session.role = role
            req.user = userData

            return res.status(200).json({
                message: 'Đăng nhập thành công',
                user: userData,
                role: role,
                csrfToken: req.session.csrfToken
            })
        }
    } else {
        return res.status(401).json({
            message: 'Phiên người dùng không hợp lệ',
            code: 'INVALID_USER_SESSION'
        })
    }
}


export const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Lỗi khi hủy session:', err)
            return res.status(500).json({
                message: 'Đã xảy ra lỗi khi đăng xuất'
            })
        }

        res.clearCookie('userSession', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
        res.clearCookie('adminSession', { path: '/admin', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
        res.clearCookie('userCsrfToken', { path: '/', httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
        res.clearCookie('adminCsrfToken', { path: '/admin', httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
        res.clearCookie('connect.sid', { path: '/', httpOnly: true, sameSite: 'strict' })
        return res.status(200).json({
            message: 'Đăng xuất thành công'
        })
    })
}
