'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Github, Linkedin, Facebook, } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { TextArea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const [isSending, setIsSending] = useState(false)
    const [noti, setNoti] = useState('')


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({ ...prevState, [name]: value }))
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSending(true)

        // simulate send message
        await new Promise(resolve => setTimeout(resolve, 2000))
        setNoti("Thank you for your message, we going to contact you as soon as possible")
        setIsSending(false)
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        })

        await new Promise(resolve => setTimeout(resolve, 2000))
        setNoti("")
    }



    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className='max-w-7xl mx-auto'>
                <div className='text-4xl font-bold text-center mb-12 tracking-tighter'>Liên hệ với chúng tôi</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* contact infomation */}
                    <Card className="border-2 border-orange space-y-4 rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-3xl">Thông tin liên hệ</CardTitle>
                            <CardDescription className="text-md">Hãy liên lạc với chúng tôi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <MapPin className="h-6 w-6 text-primary mr-2" />
                                    <span>Nhà E3, 144 Xuân Thủy, quận Cầu Giấy, Hà Nội , Việt Nam</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-6 w-6 text-primary mr-2" />
                                    <span>+84 033 330 303</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="h-6 w-6 text-primary mr-2" />
                                    <span>airlinev-support@airlinev.website</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-semibold mt-8 mb-4">Theo Dõi Chúng Tôi</h3>
                            <div className="flex space-x-5">
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-orange">
                                    <span className=" sr-only">GitHub</span>
                                    <Github className="h-6 w-6" />
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-orange">
                                    <span className="sr-only">LinkedIn</span>
                                    <Linkedin className="h-6 w-6" />
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-orange">
                                    <span className="sr-only">LinkedIn</span>
                                    <Facebook className="h-6 w-6" />
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    {/* send message */}
                    <Card className="border-2 border-orange rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-3xl">Gửi tin nhắn cho chúng tôi</CardTitle>
                            <CardDescription className="text-md">Điền vào mẫu dưới đây để liên hệ</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form className='space-y-8' onSubmit={handleSubmit}>
                                <div className='space-y-2'>
                                    <label className='text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor='name'>
                                        Name
                                    </label>
                                    <Input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John"
                                        className="border-2 border-border"
                                    />
                                </div>


                                <div className='space-y-2'>
                                    <label className='text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor='email'>
                                        Email
                                    </label>
                                    <Input
                                        type="text"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="example@gmail.com"
                                        className="border-2 border-border"
                                    />
                                </div>

                                <div className='space-y-2 '>
                                    <label className='text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor='subject'>
                                        Subject
                                    </label>
                                    <Input
                                        type="text"
                                        name="subject"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Example: Get encountered problems in refunding tickets"
                                        className="border-2 border-border"
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor='message'>
                                        Message
                                    </label>
                                    <TextArea
                                        type="text"
                                        name="message"
                                        id="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Write somethings and send for us"
                                    />
                                </div>

                                <Button variant="orange" className="bg-orange p-2" type="submit" disabled={isSending}>
                                    {isSending ? "Sending Message..." : "Send Message"}
                                </Button>
                            </form>

                            {noti && (
                                <Alert className="mt-4">
                                    <AlertDescription>{noti}</AlertDescription>
                                </Alert>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

