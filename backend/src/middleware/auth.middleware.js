import NodeCache from "node-cache"
import { admin, db } from "../database/firebaseAdmin.js"
import { getCache, userCache } from "../cache/cache.js"

const USER_COLLECTION_NAME = "users";
const ADMIN_COLLECTION_NAME = "admins";

const SESSION_COOKIE_USER = 'userSession'
const CSRF_COOKIE_USER = 'userCsrfToken'

const SESSION_COOKIE_ADMIN = 'adminSession'
const CSRF_COOKIE_ADMIN = 'adminCsrfToken'

export const verifySessionAndCSRF = async (req, res, next) => {
    const sessionCookie = req.cookies[SESSION_COOKIE_USER] || req.cookies[SESSION_COOKIE_ADMIN]
    const csrfTokenClient = req.cookies['x-csrf-token'] || req.body.csrfToken || req.cookies[CSRF_COOKIE_USER] || req.cookies[CSRF_COOKIE_ADMIN]

    if (!sessionCookie || !csrfTokenClient) {
        return res.status(403).json({
            message: 'Thiếu session cookie hoặc CSRF Token',
            code: 'CSRF_MISSING'
        })
    }

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
        const userId = decodedClaims.uid
        const expectedCsrfToken = req.session.csrfToken

        if (!expectedCsrfToken || csrfTokenClient !== expectedCsrfToken) {
            return res.status(403).json({
                message: 'CSRF token của không hợp lệ',
                code: 'CSRF_INVALID'
            })
        }

        // chech cache
        const cacheUser = getCache(userCache, userId)
        if (cacheUser) {
            req.user = cacheUser
            return next()
        }

        // get user from database
        const userDocRef = req.session?.role === 'user' ? db.collection(USER_COLLECTION_NAME).doc(userId) : db.collection(ADMIN_COLLECTION_NAME).doc(userId)
        const userDoc = await userDocRef.get()

        if (!userDoc.exists) {
            return res.status(401).json({
                message: "Không tìm thấy user hoặc admin",
                code: "USER_OR_ADMIN_NOT_FOUND"
            })
        }

        // store in cache
        const userData = { uid: userId, ...userDoc.data() }
        userCache.set(userId, userData)
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




// export const requireAuth = async (req, res, next) => {
//     try {
//         const token = req.cookies.sessionToken
//         if (!token) {
//             return res.status(401).json({
//                 message: "Không có phiên đăng nhập",
//                 code: "NO_SESSION"
//             })
//         }

//         const isAdmin = req.path.startsWith('/api/admin')
//         const userCollectionName = isAdmin ? ADMIN_COLLECTION_NAME : USER_COLLECTION_NAME

//         // verify firebase token
//         const decoded = await admin.auth().verifyIdToken(token)
//         const userId = decoded.uid

//         // check cache first
//         const cacheUser = getCache(userCache, userId)
//         if (cacheUser) {
//             req.user = cacheUser
//             return next()
//         }


//         // get user from database
//         const userDocRef = db.collection(userCollectionName).doc(userId)
//         const userDoc = await userDocRef.get()

//         if (!userDoc.exists) {
//             return res.status(401).json({
//                 message: "Không tìm thấy người dùng",
//                 code: "USER_NOT_FOUND"
//             })
//         }


//         const userData = { uid: userId, ...userDoc.data() }


//         // check for admin access
//         if (isAdmin && user.role !== 'admin') {
//             return res.status(403).json({
//                 message: "Không có quyền truy cập vào trang admin",
//                 code: "INSUFFICIENT_PERMISSIONS"
//             })
//         }


//         // store in cache
//         userCache.set(userId, userData)
//         req.user = userData
//         next()
//     } catch (error) {
//         console.error("Auth verification error:", error);

//         if (error.code === "auth/id-token-expired") {
//             return res.status(401).json({
//                 message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
//                 code: "TOKEN_EXPIRED"
//             });
//         }

//         return res.status(401).json({
//             message: "Xác thực không hợp lệ",
//             code: error.code || "INVALID_AUTH",
//             error: process.env.NODE_ENV === "development" ? error.message : undefined
//         });
//     }
// }



// export const checkRole = (roles = []) => {
//     // Cho phép truyền vào một vai trò hoặc một mảng vai trò
//     if (typeof roles === 'string') {
//         roles = [roles];
//     }

//     return (req, res, next) => {
//         try {
//             const user = req.user;

//             if (!user) {
//                 return res.status(401).json({
//                     message: "Bạn cần đăng nhập để thực hiện hành động này",
//                     code: "AUTH_REQUIRED"
//                 });
//             }

//             if (roles.length && !roles.includes(user.role)) {
//                 return res.status(403).json({
//                     message: "Bạn không có quyền thực hiện hành động này",
//                     code: "INSUFFICIENT_ROLE"
//                 });
//             }

//             next();
//         } catch (error) {
//             console.error("Role check error:", error);
//             return res.status(500).json({
//                 message: "Lỗi hệ thống khi kiểm tra quyền truy cập",
//                 code: "ROLE_CHECK_ERROR"
//             });
//         }
//     };
// };