import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from 'lucide-react'

import firebase from "@/auth/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { loginAdminApi } from "@/util/api";
import { useAuth } from "@/auth/auth";
import { useRouter } from "next/router";
import { toast } from "@/hooks/useToast";

export default function loginAdmin() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const { loginAdmin, isAdmin } = useAuth()

    const router = useRouter()

    // Redirect if already logged in as admin
    useEffect(() => {
        if (isAdmin) {
            router.push("/admin/dashboard");
        }
    }, [isAdmin, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth(firebase)
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
            const idToken = await userCredential.user.getIdToken(true)
        

            const response = await loginAdminApi(idToken)
            if (response.status === 200) {
                toast({
                    title: "Đăng nhập thành công!",
                    description: "Chào mừng admin trở lại",
                })
                loginAdmin(response.data.admin)
                router.push("/admin/dashboard")
            } else {
                toast({
                    title: "Lỗi đăng nhập",
                    description: data.message || "Đã xảy ra lỗi, vui lòng thử lại",
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
    }


    return (
        <>
            <div className="bg-[url(/clouds-background.jpg)] bg-cover bg-center flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md bg-white shadow-xl">
                    <CardTitle className="text-center font-bold text-3xl text-orange p-8">Admin Login</CardTitle>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="font-medium text-teal-900">Email</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="abc@gmail.com"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>

                            {/* password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="font-medium text-teal-900">Email</label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 inset-y-0 flex items-center px-4"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                            </div>
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-2" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-orange hover:bg-amber-700 text-white p-2 text-md text-center">
                                Đăng nhập
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}