import { useState } from "react";
import { useAuth } from "@/auth/auth";
import { toast, useToast } from "@/hooks/useToast";
import { loginGoogleApi, loginUserApi } from "@/util/api"


import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import firebase from "@/auth/firebase.js"

export const useLoginForm = (onSuccess) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [loadingGg, setLoadingGg] = useState(false);

    const { loginUser } = useAuth()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Dùng firebase SDK (client để xác thực người dùng, trả về idToken, gửi idToken đó cho firebase admin bên backend dể xác thực)
            const auth = getAuth(firebase)
            const userCredentials = await signInWithEmailAndPassword(auth, formData.email, formData.password);

            const idToken = await userCredentials.user.getIdToken(true)

            const response = await loginUserApi(idToken)

            if (response.status === 200) {
                toast({
                    title: "Đăng nhập thành công!",
                    description: "Chào mừng bạn trở lại.",
                })
                loginUser(response.data.user)

                // callback chuyển đến trang chủ (thực thi hàm ---() => router.push("/")--- bên login)
                onSuccess?.()
            }

            else {
                // Nếu backend từ chối, đăng xuất khỏi Firebase
                await auth.signOut()
                toast({
                    title: "Lỗi đăng nhập",
                    description: data.message || "Đã xảy ra lỗi, vui lòng thử lại.",
                    variant: "destructive",
                });
            }

        }
        catch (error) {
            const errorMessage = error.response?.data?.message || "Không thể kết nối tới server"
            toast({
                title: "Lỗi hệ thống",
                description: errorMessage,
                variant: "destructive",
            })
        }
        finally {
            setLoading(false)
        }
    }


    // login with google
    const handleGoogleLogin = async (e) => {
        setLoadingGg(true)
        e.preventDefault()

        try {
            const auth = getAuth(firebase)
            const googleProvider = new GoogleAuthProvider()

            const result = await signInWithPopup(auth, googleProvider)
            const idToken = await result.user.getIdToken(true)

            const response = await loginGoogleApi(idToken)

            if (response.status === 200) {
                toast({
                    title: "Đăng nhập thành công!",
                    description: "Chào mừng bạn trở lại.",
                })
                loginUser(response.data.user)
                onSuccess?.()
            }

            else {
                await auth.signOut()
                toast({
                    title: "Lỗi đăng nhập",
                    description: data.message || "Đã xảy ra lỗi, vui lòng thử lại.",
                    variant: "destructive",
                })
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Không thể kết nối tới server"
            toast({
                title: "Lỗi hệ thống",
                description: errorMessage,
                variant: "destructive",
            })
        }
        finally {
            setLoadingGg(false)
        }
    }

    return {
        formData,
        loading,
        loadingGg,
        handleSubmit,
        handleInputChange,
        handleGoogleLogin
    }
}