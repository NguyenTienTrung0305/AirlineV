'use-client'

import { AccountInfo } from "@/components/account-info/account-infomation"
import { PasswordChange } from "@/components/account-info/password-change"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAccountInfo } from "@/hooks/useAccountInfo"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function MyAccount() {
    const router = useRouter()

    // API
    const {
        personalInfo,
        setPersonalInfo,
        isLoading,
        setIsLoading,

        error,

        handleUpdate,
        isEditing,
        setIsEditing,
    } = useAccountInfo()

    return (
        <div className="min-h-screen bg-[#e6f2f7] py-8">
            <div className="container mx-auto px-4">
                <h1 className="uppercase tracking-wide text-center text-2xl font-semibold mb-8 text-zinc-500">
                    Thông tin tài khoản
                </h1>

                <Tabs defaultValue="account" className="w-full">
                    <TabsList className={`w-full bg-gray h-auto flex flex-wrap shadow-xl rounded-t-md`}>
                        <TabsTrigger
                            value="account"
                            className="flex-1 py-2 transition-all duration-150 ease-in-out uppercase tracking-tighter data-[state=active]:bg-orange data-[state=active]:text-white"
                        >
                            Thông tin cá nhân
                        </TabsTrigger>

                        <TabsTrigger
                            value="history"
                            className="flex-1 py-2 transition-all duration-150 ease-in-out uppercase tracking-tighter data-[state=active]:bg-orange data-[state=active]:text-white"
                        >
                            Lịch sử hoạt động
                        </TabsTrigger>

                        <TabsTrigger
                            value="changepassword"
                            className="flex-1 py-2 transition-all duration-150 ease-in-out uppercase tracking-tighter data-[state=active]:bg-orange data-[state=active]:text-white"
                        >
                            Thay đổi mật khẩu
                        </TabsTrigger>
                    </TabsList>

                    <Card className="mt-4 border-0 shadow-xl">
                        <TabsContent value="account">
                            <AccountInfo
                                personalInfo={personalInfo}
                                setPersonalInfo={setPersonalInfo}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                handleUpdate={handleUpdate}
                                isLoading={isLoading}
                            />
                        </TabsContent>

                        <TabsContent value="history">
                            <h1 className="text-center text-xl font-semibold mb-4 text-zinc-800">
                                History
                            </h1>
                        </TabsContent>

                        {/* change pasword */}
                        <TabsContent value="changepassword">
                            <PasswordChange 
                                personalInfo={personalInfo}
                            />
                        </TabsContent>
                    </Card>
                </Tabs>
            </div>
        </div>
    )
}