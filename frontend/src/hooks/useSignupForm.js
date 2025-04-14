import { toast } from "@/hooks/useToast";
import { useState } from "react";
import { signupUserApi } from "@/util/api.js"

export const useSignupForm = (onSuccess) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Lỗi đăng ký",
                description: "Mật khẩu và xác nhận mật khẩu không khớp.",
                variant: "destructive",
            })
            return;
        }

        setLoading(true)

        try {
            const response = await signupUserApi(formData);

            toast({
                title: "Đăng ký thành công!",
                description: "Tài khoản đã được tạo thành công.",
            });

            // Gọi callback => chuyển đến trang login
            if (onSuccess) onSuccess();

        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Không thể tạo tài khoản.";

            toast({
                title: "Lỗi đăng ký",
                description: errorMessage,
                variant: "destructive",
            });

            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    }
    return {
        formData,
        loading,
        handleInputChange,
        handleSubmit,
    };
} 