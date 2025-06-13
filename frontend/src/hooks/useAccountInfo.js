import { useAuth } from "@/auth/auth";
import axios from "@/util/axiosCustom";
import { useEffect, useState } from "react";


// Helper function to normalize date format
const normalizeDateFormat = (dateValue) => {
    if (!dateValue) return null

    // If it's a Firebase Timestamp, convert to ISO string
    if (dateValue._seconds) {
        return new Date(dateValue._seconds * 1000).toISOString()
    }

    // If it's already a Date object, convert to ISO string
    if (dateValue instanceof Date) {
        return dateValue.toISOString()
    }

    // If it's already a string, return as is
    if (typeof dateValue === 'string') {
        return dateValue
    }

    return null
}


// main hooks
export function useAccountInfo() {
    const { user, checkSession } = useAuth()

    const [personalInfo, setPersonalInfo] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)


    const handleUpdate = async (uid, updatedInfo) => {
        setIsLoading(true)
        try {
            const response = await axios.post("/api/account/update", { uid, updatedInfo })
            if (response.status === 200) {

                const normalizedData = {
                    ...response.data.data,
                    dateOfBirth: normalizeDateFormat(response.data.data.dateOfBirth)
                }
                setPersonalInfo(normalizedData)

                // refresh session
                await checkSession()

                setIsEditing(false)
            } else {
                setError("Lỗi khi cập nhật thông tin tài khoản", response.data.code)
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Đồng bộ dữ liệu
    useEffect(() => {
        if (user) {
            setPersonalInfo({
                uid: user.uid || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                address: user.address || "",
                phoneNumber: user.phoneNumber || "",
                gender: user.gender || "",
                dateOfBirth: normalizeDateFormat(user.dateOfBirth),
                passportNumber: user.passportNumber || "",
                bookingHistory: user.bookingHistory || [],
            })
        }
    }, [user])

    return {
        personalInfo,
        setPersonalInfo,
        isLoading,
        setIsLoading,

        error,

        handleUpdate,
        isEditing,
        setIsEditing
    }
}