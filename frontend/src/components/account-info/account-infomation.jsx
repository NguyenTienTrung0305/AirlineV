import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SkeletonFlightCard } from "../FlightComponent/FlightSkeleton";


const convertToISOString = (dateValue) => {
    if (!dateValue) return ""

    // timestamp
    if (dateValue._seconds) {
        return new Date(dateValue._seconds * 1000).toISOString().split("T")[0]
    }

    // If it's already a Date object
    if (dateValue instanceof Date) {
        return dateValue.toISOString().split("T")[0]
    }

    // If it's already an ISO string
    if (typeof dateValue === 'string') {
        return new Date(dateValue).toISOString().split("T")[0]
    }

    return ""
}


// Helper function to format date for display
const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return "--"

    let date

    // If it's a Firebase Timestamp
    if (dateValue._seconds) {
        date = new Date(dateValue._seconds * 1000)
    }

    // If it's already a Date object
    else if (dateValue instanceof Date) {
        date = dateValue
    }

    // If it's a string
    else if (typeof dateValue === 'string') {
        date = new Date(dateValue)
    }
    else {
        return "--"
    }

    return date.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}


export function AccountInfo({
    personalInfo,
    isEditing,
    setIsEditing,
    handleUpdate,
    isLoading
}) {
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        phoneNumber: "",
        passportNumber: "",
        gender: "other",
        dateOfBirth: "",
    })

    // Khởi tạo formdata từ personalInfo
    useEffect(() => {
        if (personalInfo) {
            setFormData({
                fullName: `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim(),
                address: personalInfo.address || "",
                phoneNumber: personalInfo.phoneNumber || "",
                passportNumber: personalInfo.passportNumber || "",
                gender: personalInfo.gender || "other",
                dateOfBirth: convertToISOString(personalInfo.dateOfBirth)
            })
        }
    }, [personalInfo])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    };


    if (!personalInfo) {
        return <div className="p-3">Đang tải thông tin...</div>
    }

    const uid = personalInfo.uid || "--"
    const email = personalInfo.email || "--"


    const handleSubmit = (e) => {
        e.preventDefault()
        const nameParts = formData.fullName.trim().split(/\s+/)
        const lastNameU = nameParts.length > 1 ? nameParts.pop() : ""
        const firstNameU = nameParts.join(" ") || ""

        // Validate and convert birth date - always send as ISO string
        let birthDateU = null
        if (formData.dateOfBirth) {
            const dateObj = new Date(formData.dateOfBirth)
            if (isNaN(dateObj)) {
                setError("Ngày sinh không hợp lệ")
                return
            }
            birthDateU = dateObj.toISOString() // Send as ISO string
        }

        if (formData.phoneNumber && !formData.phoneNumber.match(/^\d{10,}$/)) {
            setError("Số điện thoại không hợp lệ")
            return
        }



        const updatedData = {
            ...personalInfo,
            firstName: firstNameU,
            lastName: lastNameU,
            address: formData.address || null,
            phoneNumber: formData.phoneNumber || null,
            passportNumber: formData.passportNumber || null,
            gender: formData.gender,
            dateOfBirth: birthDateU
        }

        handleUpdate(uid, updatedData)
    }


    return (
        <div className="p-4 sm:p-6">
            {isLoading ? (
                <SkeletonFlightCard />
            ) : (
                <>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <div className="flex flex-col md:flex-row md:space-x-8 md:space-y-0 space-y-6">
                        {/* avatar */}
                        <div className="w-full md:w-1/3">
                            <Card className="p-0 shadow-lg rounded-lg relative h-48 sm:h-64">
                                <Image
                                    src="/AvatarUser/Mr-P.jpg"
                                    alt="Mr-p"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="rounded-lg"
                                />
                            </Card>
                        </div>

                        {/* info */}
                        <div className="w-full md:w-2/3">
                            {isEditing ? (
                                <form
                                    className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6"
                                    onSubmit={handleSubmit}
                                >
                                    {/* MÃ THẺ HỘI VIÊN */}
                                    <div className="space-y-1">
                                        <label className="text-sm text-zinc-600">Mã thẻ hội viên</label>
                                        <Input type="text" value={uid} disabled />
                                    </div>

                                    {/* HỌ VÀ TÊN */}
                                    <div className="space-y-1">
                                        <label className="text-sm text-zinc-600">Họ và tên</label>
                                        <Input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label className="text-sm text-zinc-600">Email</label>
                                        <Input type="text" value={email} disabled />
                                    </div>

                                    {/* ĐỊA CHỈ */}
                                    <div className="space-y-1">
                                        <label className="text-sm text-zinc-600">Địa chỉ</label>
                                        <Input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Nhập địa chỉ"
                                        />
                                    </div>

                                    {/* Số điện thoại */}
                                    <div className="space-y-1">
                                        <label className="text-sm text-zinc-600">Số điện thoại</label>
                                        <Input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-1">
                                        <label className="text-sm text-zinc-600">Giới tính</label>
                                        <select
                                            name="gender"
                                            className="block w-full px-4 py-2 rounded-lg border border-red-950"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                        >
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>

                                    {/* Birthday */}
                                    <div className="space-y-1">
                                        <label className="text-sm text-zinc-600">Ngày sinh</label>
                                        {/* Dữ liệu trả về là string có dạng "YYYY-MM-DD" (Không phải Date, ISO hay timestamp) */}
                                        {/* value nhận vào cũng phải có dạng "YYYY-MM-DD" */}
                                        <Input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Số hộ chiếu */}
                                    <div className="space-y-1">
                                        <label className="text-sm text-gray-600">Số hộ chiếu</label>
                                        <Input
                                            type="text"
                                            name="passportNumber"
                                            value={formData.passportNumber}
                                            onChange={handleInputChange}
                                            placeholder="Nhập số hộ chiếu"
                                        />
                                    </div>

                                    <div className="md:col-span-2 pt-2 flex space-x-4">
                                        <Button
                                            type="submit"
                                            className="px-6 py-2 bg-orange text-white rounded-md hover:bg-opacity-75 transition-all"
                                        >
                                            Lưu thông tin
                                        </Button>
                                        <Button
                                            onClick={() => setIsEditing(false)}
                                            variant="default"
                                            className="px-6 py-2"
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">Mã thẻ hội viên</div>
                                        <div className="font-semibold">{uid}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">Họ và tên</div>
                                        <div className="font-semibold">{formData.fullName || "--"}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">Email</div>
                                        <div className="font-semibold">{email}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">Địa chỉ</div>
                                        <div className="font-semibold">{formData.address || "--"}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">Số điện thoại</div>
                                        <div className="font-semibold">{formData.phoneNumber || "--"}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">Giới tính</div>
                                        <div className="font-semibold">
                                            {formData.gender === "male"
                                                ? "Nam"
                                                : formData.gender === "female"
                                                    ? "Nữ"
                                                    : "Khác"}
                                        </div>
                                    </div>


                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">Ngày sinh</div>
                                        <div className="font-semibold">
                                            {formatDateForDisplay(personalInfo.dateOfBirth)}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-600">Số hộ chiếu</div>
                                        <div className="font-semibold">{formData.passportNumber || "--"}</div>
                                    </div>
                                    <div className="md:col-span-2 pt-2">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full sm:w-auto px-6 py-2 bg-orange text-white rounded-lg hover:bg-orangeLight transition-all"
                                        >
                                            Cập nhật thông tin
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}