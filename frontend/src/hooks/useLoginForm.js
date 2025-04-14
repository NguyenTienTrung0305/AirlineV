import { useState } from "react";
import { useAuth } from "@/auth/auth";
import { useToast } from "@/hooks/useToast";
import { loginUserApi } from "@/util/api"

export const useLoginForm = (onSuccess) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const { login } = useAuth()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await loginUserApi(formData.email, formData.password)
            if (response.ok) {
                const { token } = response.data
                login(token);
                toast({
                    title: "Đăng nhập thành công!",
                    description: "Chào mừng bạn trở lại.",
                });
                if (onSuccess) onSuccess();
            }
            else {
                toast({
                    title: "Lỗi đăng nhập",
                    description: data.message || "Đã xảy ra lỗi, vui lòng thử lại.",
                    variant: "destructive",
                });
            }

        }
        catch (error) {

        }
    }

}