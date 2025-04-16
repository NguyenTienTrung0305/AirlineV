import {
    getFirestore,
    collection,
    collectionGroup,

    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc
} from "firebase/firestore"

import firebase from "../../database/firebase.js"
import firebaseadmin from "../../database/firebaseAdmin.js"
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth"
import User from "../../models/users/User.model.js"


const db = getFirestore(firebase)
const adminAuth = firebaseadmin.auth()

const USER_COLLECTION_NAME = "users"
const firebaseAuth = getAuth(firebase)

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
        // này có khớp với tài khoản nào đã được tạo trước đó không bằng adminAuth.createUser
        const userPromise = adminAuth.createUser({ email: email, password: password })

        const newUser = new User({ firstName, lastName, email })
        newUser.createdAt = new Date()
        newUser.updatedAt = new Date()

        const user = await userPromise
        newUser.uid = user.uid

        const userref = doc(db, USER_COLLECTION_NAME, user.uid)
        await setDoc(userref, newUser.toObject())
        return newUser
    }
    catch (error) {
        throw new Error(`creating user failed: ${error.message}`)
    }
}


export const dbGetUserById = async (uid) => {
    try {
        const userref = doc(db, USER_COLLECTION_NAME, uid)
        const userDoc = await getDoc(userref)

        if (userDoc.exists()) {
            const user = new User({ ...userDoc.data() })
            return user
        }

        throw new Error(`user not found: ${uid}`)
    }
    catch (error) {
        throw new Error(`getting user failed: ${error.message}`)
    }
}

export const dbGetUserByEmail = async (email) => {
    try {
        const usersRef = collection(db, USER_COLLECTION_NAME)
        const query = query(usersRef, where("email", "==", email))
        const querySnapshot = await getDocs(query)

        if (querySnapshot.empty) {
            throw new Error(`user not found: ${email}`)
        }

        const user = new User({ ...querySnapshot.docs[0].data() })
        user.uid = querySnapshot.docs[0].id

        return user
    }
    catch (error) {
        throw new Error(`getting user failed: ${error.message}`)
    }
}
