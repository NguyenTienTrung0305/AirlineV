import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "@/hooks/useToast";
import axios from "@/util/axiosCustom";

import { EmailAuthProvider, getAuth, reauthenticateWithCredential } from "firebase/auth";
import firebase from "@/auth/firebase.js";
import { useRouter } from "next/router";

export function PasswordChange({ personalInfo }) {

    const router = useRouter()

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)


    const isPasswordStrong = (password) => {
        const minLength = 8
        const hasNumber = /\d/.test(password)
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasSpecialCharacter = /[@$!%*?&]/.test(password)

        return (
            password.length >= minLength &&
            hasNumber &&
            hasLowerCase &&
            hasSpecialCharacter &&
            hasUpperCase
        )
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        if (!personalInfo) {
            toast({
                title: "Lỗi",
                description: "Không thể tải thông tin người dùng. Vui lòng thử lại.",
                variant: "destructive",
            })
            setIsLoading(false)
            return
        }
        if (currentPassword === newPassword) {
            toast({
                title: "Lỗi",
                description: "Mật khẩu mới phải khác mật khẩu cũ, vui lòng nhập lại",
                variant: "destructive",
            })
            setIsLoading(false)
            return
        }

        if (confirmPassword !== newPassword) {
            toast({
                title: "Lỗi",
                description: "Mật khẩu mới và mật khẩu xác nhận không khớp, vui lòng nhập lại.",
                variant: "destructive",
            })
            setIsLoading(false)
            return
        }

        if (!isPasswordStrong(newPassword)) {
            toast({
                title: "Lỗi",
                description: "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm số, chữ hoa, chữ thường và ký tự đặc biệt (@$!%*?&).",
                variant: "destructive",
            });
            setIsLoading(false)
            return
        }

        try {
            // xác minh lại mật khẩu hiện tại
            const auth = getAuth(firebase)
            const user = auth.currentUser;
            if (!user) {
                router.push('/login')
                throw new Error("Người dùng chưa đăng nhập.")
            }

            const credential = EmailAuthProvider.credential(personalInfo.email, currentPassword)
            if (!credential) {
                toast({
                    title: "Lỗi",
                    description: "Mật khẩu xác thực không đúng.",
                    variant: "destructive",
                });
                setIsLoading(false)
                return
            }
            await reauthenticateWithCredential(user, credential)

            const response = await axios.post(`/api/user/change-password?uid=${personalInfo.uid}`, {
                newPassword: newPassword,
            })
            if (response.status === 200) {
                toast({
                    title: "Thành công",
                    description: "Mật khẩu đã được thay đổi thành công.",
                })

                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")

                router.push("/")

            } else {
                throw new Error("Có lỗi xảy ra, vui lòng thử lại.")
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-xl font-bold text-center mb-6 text-zinc-600">Thông tin mật khẩu</h1>
            <p className="text-center text-red-600 text-sm mb-6"> Mật khẩu tối thiểu phải có 8 ký tự, không giới hạn độ dài tối đa. Mật khẩu phải bao gồm ít nhất 1 ký tự số, 1 chữ cái hoa, 1 chữ cái thường và 1 ký tự đặc biệt (@ $ ! % * ? &). Ví dụ: Matkhau@123</p>

            <form onSubmit={handleSubmit}>
                <div className="space-y-2 mb-6">
                    <label className="block">
                        Mật khẩu hiện tại
                        <span className="text-red-500">
                            *
                        </span>
                    </label>
                    <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>


                <div className="space-y-2 mb-6">
                    <label className="block">
                        Mật khẩu mới
                        <span className="text-red-500">
                            *
                        </span>
                    </label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>


                <div className="space-y-2 mb-6">
                    <label className="block">
                        Xác nhận mật khẩu mới
                        <span className="text-red-500">
                            *
                        </span>
                    </label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="text-right">
                    <Button type="submit" className="bg-red-500 text-white hover:bg-red-400 p-1" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "LƯU"}
                    </Button>
                </div>
            </form>
        </div>
    )
}