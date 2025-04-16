import firebase from "../../database/firebase.js"
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import admin from "../../database/firebaseAdmin.js"

import { dbCreateUser, dbGetUserById } from "../../services/users/User.service.js"

const firebaseAuth = getAuth(firebase)

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            email,
            password
        )

        const user = userCredential.user
        const userId = user.uid

        // check again
        const promiseGetUser = dbGetUserById(userId)
        const promiseGetIdToken = user.getIdToken()
        const [user_, idtoken] = await Promise.all([promiseGetUser, promiseGetIdToken])

        res.status(200).json({
            user: user_,
            token: idtoken,
            message: "Login Success"
        })
    } catch (err) {
        res.status(400).json({ message: "Email or password is incorrect" })
    }
}

// Khi người dùng nhấn vào icon Google:
// Trình duyệt sẽ mở một popup Google Sign-In (hoặc chuyển hướng trang, tùy bạn dùng signInWithPopup hay signInWithRedirect)
// Người dùng chọn tài khoản Google
// Sau khi thành công, Firebase frontend SDK sẽ trả về thông tin user + idToken
// Bạn gửi idToken về backend để xác minh
export const googleLogin = async (req, res) => {
    const { idtoken } = req.body
    try {
        const decodeToken = await admin.auth().verifyIdToken(idtoken)
        const uid = decodeToken.uid

        const userData = await dbGetUserById(uid);
        res.status(200).json({
            user: userData,
            token: idtoken,
            message: "Google login success",
        })
    }

    catch (error) {
        console.error("Google login failed:", error);
        res.status(400).json({ message: "Google login failed" });
    }
}



export const adminLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }
        const userCredential = await admin.auth().signInWithEmailAndPassword(firebaseAuth, email, password)
        const user = userCredential.user
        const userId = user.uid

        // check again
        const promiseGetAdmin = dbGetAdminById(userId)
        const promiseGetIdToken = user.getIdToken()
        const [admin, idtoken] = await Promise.all([promiseGetAdmin, promiseGetIdToken])

        res.status(200).json({
            user: admin,
            token: idtoken,
            message: "Login Success"
        })
    }
    catch (error) {
        res.status(400).json({ message: "Email or password is incorrect" })
    }
}



// // frontend web sdk
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

// const auth = getAuth();
// const provider = new GoogleAuthProvider();

// signInWithPopup(auth, provider)
//   .then(async (result) => {
//     const idToken = await result.user.getIdToken();

//     // Gửi token về server để xử lý đăng nhập
//     const res = await fetch("http://localhost:3000/api/auth/google", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ idToken }),
//     });

//     const data = await res.json();
//     console.log("Login success!", data);
//   })
//   .catch((err) => {
//     console.error("Login failed", err);
//   });