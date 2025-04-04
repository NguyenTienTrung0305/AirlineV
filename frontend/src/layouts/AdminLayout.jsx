import AdminNavbar from "@/components/admin/navbar";
import { useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminLayout = ({ children }) => {
    const [dropdown, setDropdown] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const showDropdown = () => {
        if (dropdown) {
            setIsClosing(true)
            setTimeout(() => {
                setDropdown(false)
                setIsClosing(false)
            }, 1000) // time animations
        } else {
            setDropdown(true)
        }
    }

    useEffect(() => {
        AOS.init({
            duration: 1500,
            once: true
        });
    }, []);


    return (
        <div className="flex flex-row min-h-screen">
            {/* Navbar cố định trên desktop */}
            <div className="fixed top-0 z-50 shadow-lg max-lg:hidden w-64">
                <AdminNavbar />
            </div>

            {/* Navbar mobile (hiển thị khi click nút) */}
            {dropdown && (
                <div
                    className={`fixed top-0 left-0 z-[100] h-screen w-64 transition-transform duration-1000 ease-linear ${isClosing ? "translate-x-[-100%]" : "translate-x-0"}`}
                    data-aos="fade-right"
                >
                    <AdminNavbar />
                </div>
            )}

            <div className="flex-1 p-4">
                <div
                    onClick={showDropdown}
                    className="lg:hidden text-[22px] cursor-pointer fixed top-4 right-4 z-50 p-2"
                >
                    {dropdown ? <MdClose /> : <HiMenuAlt3 />}
                </div>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;