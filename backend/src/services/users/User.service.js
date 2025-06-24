import { auth, db } from "../../database/firebaseAdmin.js"

import User from "../../models/users/User.model.js"

const USER_COLLECTION_NAME = "users"

export const dbCreateUser = async ({
    email,
    firstName,
    lastName,
    password
}) => {
    try {
        // Tạo một tài khoản mới trên Firebase, với email và mật khẩu mà người dùng nhập từ từ form đăng ký
        // Lưu tài khoảng trên firebase, sử dụng cùng với firebase-client sdk để xác thực người dùng 
        // firebase-client sdk sẽ gửi thông tin đăng nhập đến firebase, Firebase kiểm tra xem email và mật khẩu 
        // này có khớp với tài khoản nào đã được tạo trước đó không, nếu có trả về idToken
        const userRecord = await auth.createUser({ email: email, password: password })

        const newUser = new User({ firstName, lastName, email })
        newUser.createdAt = new Date()
        newUser.updatedAt = new Date()
        newUser.uid = userRecord.uid

        // tạo document mới có uid là userRecord.uid (chưa tồn tại thì firebase sẽ tự tạo), chứa các field của newUser
        // users (collection)
        // └── user123 (document uid)
        //     └── { firstName: "John", email: "john@email.com", uid: "okjiKHNNajs"... }
        const userRef = db.collection(USER_COLLECTION_NAME).doc(userRecord.uid)
        await userRef.set(newUser.toObject())
        return newUser
    }
    catch (error) {
        throw new Error(`creating user failed: ${error.message}`)
    }
}


export const dbCreateUserFromGoogle = async (uid, userData) => {
    try {
        // Không cần tạo user trên Firebase Auth vì Google đã tạo rồi
        // Chỉ cần tạo document trong Firestore với uid đã có
        const newUser = new User({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role,
        })

        newUser.uid = uid
        newUser.createdAt = userData.createdAt
        newUser.updatedAt = userData.updatedAt

        const userRef = db.collection(USER_COLLECTION_NAME).doc(uid)
        await userRef.set(newUser.toObject())

        return newUser
    }
    catch (error) {
        console.log(`creating user from Google failed: ${error.message}`)
        return null
    }
}

export const dbGetUserById = async (uid) => {
    try {
        const userRef = db.collection(USER_COLLECTION_NAME).doc(uid)
        const userDoc = await userRef.get()

        if (userDoc.exists) {
            const user = new User({ ...userDoc.data() })
            user.uid = userDoc.id
            return user
        }
        return null
    }
    catch (error) {
        console.error(`Error getting user ${uid}:`, error.message)
        return null
    }
}

export const dbGetUserByEmail = async (email) => {
    try {
        const usersRef = db.collection(USER_COLLECTION_NAME)
        const query = usersRef.where('email', '==', email)
        const querySnapshot = await query.get()

        if (querySnapshot.empty) {
            throw new Error(`user not found: ${email}`)
        }

        const userDoc = querySnapshot.docs[0]
        const user = new User({ ...userDoc.data() })
        user.uid = userDoc.id
        return user
    }
    catch (error) {
        throw new Error(`getting user failed: ${error.message}`)
    }
}


export const dbUpdateUser = async (uid, dataUser) => {
    try {
        const userRef = db.collection(USER_COLLECTION_NAME).doc(uid)
        await userRef.update(dataUser)
        return true
    }
    catch (error) {
        console.log(`updating user ${uid} failed: ${error.message}`)
        return false
    }
}
