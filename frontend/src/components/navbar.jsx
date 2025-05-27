'use client'

import { useRouter } from "next/router"
import { useState } from "react";
import Link from "next/link"
import Image from "next/image"
import { CiSearch } from "react-icons/ci";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/auth/auth";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { BsPersonCircle } from "react-icons/bs";


export default function NavBar() {

    const router = useRouter();
    const [dropdown, setDropdown] = useState(false);

    const showDropdown = () => {
        setDropdown(!dropdown)
    }

    const { isAuthenticated, isUser, logout } = useAuth();

    const handleLogout = () => {
        logout()
        setDropdown(false)
    }

    return (
        <nav className="w-full h-24 flex items-center sticky top-0 z-50 bg-white nav-shadow">
            <div className="max-w-screen-xl mx-auto w-full px-4">
                <div className="flex items-center justify-between w-full">
                    {/* Logo */}
                    <div className="flex items-center ml-4">
                        <Link href="/">
                            <Image
                                src="/logo-1.png"
                                alt="Logo"
                                className="w-36"
                                width={144}
                                height={144}
                            />
                        </Link>
                    </div>

                    {/* Menu */}
                    {/*flex-1: Cho phép <ul> chiếm toàn bộ không gian còn lại trong thanh navigation */}
                    <ul className="flex items-center justify-center gap-x-8 lg:gap-x-12 max-lg:hidden flex-1">
                        <li>
                            <Link
                                href="/"
                                className={`leading-normal no-underline text-lg
                                            {/*Nếu trang hiện tại là / (Trang chủ) → Chữ có màu cam (text-orange).
                                            Nếu không phải trang hiện tại, khi di chuột vào (hover) → Chữ chuyển thành 
                                            màu cam (hover:text-orange) */}
                                            ${router.pathname === '/' ? 'text-orange' : 'hover:text-orange'}`}
                            >
                                Trang chủ
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/flights"
                                className={`leading-normal no-underline text-lg 
                                        ${router.pathname === '/flights' ? 'text-orange' : 'hover:text-orange'}`}
                            >
                                Chuyến bay
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/news"
                                className={`leading-normal no-underline text-lg 
                                     ${router.pathname === '/news' ? 'text-orange' : 'hover:text-orange'}`}
                            >
                                Tin tức
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/contact"
                                className={`leading-normal no-underline text-lg 
                                     ${router.pathname === '/contact' ? 'text-orange' : 'hover:text-orange'}`}
                            >
                                Liên hệ
                            </Link>
                        </li>
                    </ul>


                    {/* button search, đăng nhập, đăng ký, dropdown*/}
                    <div className="flex items-center gap-4 max-lg:hidden mr-4">
                        <button className="rounded-full bg-[#faf5ee] text-gray w-10 h-10 flex items-center justify-center hover:bg-orange hover:text-white">
                            <CiSearch size={20} />
                        </button>
                        {(isAuthenticated && isUser) ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="rounded-full bg-[#faf5ee] text-gray w-10 h-10 flex items-center justify-center hover:bg-orange hover:text-white p-0">
                                        <BsPersonCircle size={20} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56">
                                    <div className="grid gap-4">
                                        <Link href="/my-account" className="flex items-center gap-2 text-sm">
                                            <BsPersonCircle size={16} />
                                            Thông tin tài khoản
                                        </Link>
                                        <Link href="/settings" className="flex items-center gap-2 text-sm">
                                            <FiSettings size={16} />
                                            Cài đặt
                                        </Link>
                                        <button onClick={logout} className="flex items-center gap-2 text-sm text-red-600">
                                            <FiLogOut size={16} />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" className="hover:bg-orange hover:text-white p-2 text-md">
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="ghost" className="hover:bg-orange hover:text-white p-2 text-md">
                                        Đăng ký
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* icon dropdown menu*/}
                    <div
                        onClick={showDropdown}
                        className="lg:hidden text-[22px] cursor-pointer"
                    >
                        {dropdown ? <MdClose /> : <HiMenuAlt3 />}
                    </div>

                    {/* menu dropdown menu*/}
                    {dropdown && (
                        <div className="lg:hidden w-full fixed top-24 bg-white transition-all">
                            <div className="w-full flex flex-col items-start gap-4">
                                <ul className="flex flex-col justify-center w-full">
                                    <li>
                                        <Link
                                            href="/"
                                            className="px-6 h-10 flex items-center leading-normal no-underline text-lg border-b border-gray-200 font-bold hover:text-orange"

                                        >
                                            Trang chủ
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href="/flights"
                                            className="px-6 h-10 flex items-center leading-normal no-underline text-lg border-b border-gray-200 font-bold hover:text-orange"

                                        >
                                            Chuyến bay
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href="/news"
                                            className="px-6 h-10 flex items-center leading-normal no-underline text-lg border-b border-gray-200 font-bold hover:text-orange"

                                        >
                                            Tin tức
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href="/contact"
                                            className="px-6 h-10 flex items-center leading-normal no-underline text-lg border-b border-gray-200 font-bold hover:text-orange "

                                        >
                                            Liên hệ
                                        </Link>
                                    </li>
                                    {(isAuthenticated && isUser) ? (
                                        <>
                                            <li>
                                                <Link
                                                    href="/my-account"
                                                    className="px-6 h-10 flex items-center leading-normal no-underline text-lg border-b border-gray-200 font-bold hover:text-orange"

                                                >
                                                    Tài khoản của tôi
                                                </Link>

                                            </li>

                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full px-6 h-10 flex items-center leading-normal no-underline text-lg border-b border-gray-200 font-bold hover:text-orange gap-3 flex-1 text-red-600"

                                                >
                                                    <FiLogOut />
                                                    Đăng xuất
                                                </button>
                                            </li>
                                        </>

                                    ) : (
                                        <>
                                            <li>
                                                <Link
                                                    href="/login"
                                                    className="px-6 h-10 flex items-center leading-normal no-underline font-bold text-lg border-b border-gray-200 text-teal-700  hover:text-orange"

                                                >
                                                    Đăng nhập
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/signup"
                                                    className="px-6 h-10 flex items-center leading-normal no-underline font-bold text-lg border-b border-gray-200 text-teal-700 hover:text-orange"
                                                >
                                                    Đăng ký
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav >
    )
}