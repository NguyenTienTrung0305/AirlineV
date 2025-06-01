import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { useLoginForm } from "@/hooks/useLoginForm";
import { useRouter } from "next/router";

export default function Login() {
    const router = useRouter()

    const {
        formData,
        loading,
        handleInputChange,
        handleSubmit,
        handleGoogleLogin
    } = useLoginForm(() => router.push("/"))


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[url(/clouds-background.jpg)] bg-cover bg-center p-5">
            <div className="max-w-lg w-full bg-white rounded-md shadow-lg">
                <h1 className="text-orange text-4xl font-bold text-center pt-4 pb-2">Chào mừng trở lại</h1>
                <p className="text-gray  text-md text-center">Nhập thông tin đăng nhập để truy cập tài khoản của bạn</p>

                <div>
                    <form className="space-y-4 px-6 py-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="email@example.com"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#e8604c]"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type={"password"}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#e8604c]"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="default"
                            className="w-full text-white p-2 text-xl bg-orange"
                        >
                            Đăng nhập
                        </Button>
                    </form>

                    <div className="relative mb-4 mx-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border border-t-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-sm z-1">
                            <span className="bg-white px-2">OR</span>
                        </div>
                    </div>

                    <div className="px-6">
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full p-2 text-lg"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <FcGoogle />
                            {loading ? "Đang đăng nhập..." : "Đăng nhập với Google"}
                        </Button>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 gap-4">
                        <Button variant="link" className="text-[#e8604c] hover:text-[#d55643] text-md">
                            Quên mật khẩu?
                        </Button>
                        <p className="text-md text-center text-gray-600">
                            Bạn chưa có tài khoản?{" "}
                            <Link href="/signup">
                                <Button variant="link" className="p-0 text-[#e8604c] hover:text-[#d55643] text-md">
                                    Đăng ký
                                </Button>
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}