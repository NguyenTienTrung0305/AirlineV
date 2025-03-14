import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[url(/clouds-background.jpg)] bg-cover bg-center p-5">
            <div className="max-w-lg w-full bg-white rounded-md shadow-lg">
                <h1 className="text-orange text-4xl font-bold text-center pt-4 pb-2">Tạo tài khoản</h1>
                <p className="text-gray  text-md text-center">Nhập thông tin của bạn để đăng ký tài khoản mới</p>

                <div>
                    <form className="space-y-4 px-6 py-6">
                        <div className="space-y-2">
                            <div className="flex justify-between pb-4 w-full">
                                <div className="space-y-2 w-[45%]">
                                    <label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                                        Họ
                                    </label>
                                    <Input
                                        id="firstname"
                                        name="firstname"
                                        type="text"
                                        placeholder="Nguyễn"
                                        required
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#e8604c]"

                                    />
                                </div>

                                <div className="space-y-2 w-[45%]">
                                    <label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                                        Tên
                                    </label>
                                    <Input
                                        id="lastname"
                                        name="lastname"
                                        type="text"
                                        placeholder="John"
                                        required
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#e8604c]"

                                    />
                                </div>

                            </div>
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
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Repeat Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type={"password"}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#e8604c]"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="default"
                            className="w-full text-white p-2 text-xl bg-orange"
                        >
                            Đăng ký
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
                            onClick={() => {
                                console.log("Google sign-in clicked");
                            }}
                        >
                            <FcGoogle />
                            Đăng nhập với Google
                        </Button>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 gap-4">
                        <p className="text-md text-center text-gray-600">
                            Bạn đã có tài khoản?
                            <Link href="/login">
                                <Button variant="link" className="p-0 text-[#e8604c] hover:text-[#d55643] text-md">
                                    Đăng Nhập
                                </Button>
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}