import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "@/hooks/useToast";
import axios from "@/util/axiosCustom";

export function PasswordChange({ personalInfo }) {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!personalInfo) {
            toast({
                title: "Lỗi",
                description: "Không thể tải thông tin người dùng. Vui lòng thử lại.",
                variant: "destructive",
            })
            return
        }
        if (confirmPassword !== newPassword) {
            toast({
                title: "Lỗi",
                description: "Mật khẩu mới và mật khẩu xác nhận không khớp, vui lòng nhập lại.",
                variant: "destructive",
            })
            return
        }

        try {
            const response = await axios.post(`/api/user/change-password?id=${personalInfo.uid}`)
            if (response.status === 200) {
                toast({
                    title: "Thành công",
                    description: "Mật khẩu đã được thay đổi thành công.",
                })

                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            } else {
                throw new Error("Có lỗi xảy ra, vui lòng thử lại.")
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: err.message,
                variant: "destructive",
            })
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
                    />
                </div>

                <div className="text-right">
                    <Button type="submit" className="bg-red-500 text-white hover:bg-red-400 p-1 w-[40px]">
                        LƯU
                    </Button>
                </div>
            </form>
        </div>
    )
}