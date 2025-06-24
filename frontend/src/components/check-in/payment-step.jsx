import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight, Building2, ChevronRight } from "lucide-react";
import unidecode from "unidecode";

export function PaymentStep({
    amount,
    passengerCount,
    paymentStatus,
    onPayment,
    onBack,
    onVerifyPayment
}) {
    const [timeLeft, setTimeLeft] = useState(900)

    const [paymentType, setPaymentType] = useState("CreditCard")
    const [paymentDetails, setPaymentDetails] = useState({})
    const [qrCode, setQrCode] = useState(null)

    const [cardHolderName, setCardHolderName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardExpiry, setCardExpiry] = useState("")
    const [cardCvv, setCardCvv] = useState("")


    // countdown timer
    useEffect(() => {
        if (paymentStatus === "processing" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((timeLeft) => timeLeft - 1)
            }, 1000)
            return clearInterval(timer)
        }
    }, [paymentStatus, timeLeft])


    // Generate QR code cho bank transfer
    useEffect(() => {
        if (paymentType === 'BankTransfer') {
            const bankInfo = {
                bankCode: "VCB",
                accountNumber: "1030014478",
                accountName: "NGUYEN TIEN TRUNG",
                amount: amount,
                description: `Payment for ${removeDiacritics(cardHolderName)} booking - CHECKIN_${Date.now()}`
            }

            setPaymentDetails(bankInfo)

            const qrCode = `https://img.vietqr/io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-compact2.jpg?amount=${amount}&addInfo=${bankInfo.description}`
            setQrCode(qrCode)
        }
    }, [paymentType, amount])

    function removeDiacritics(str) {
        return unidecode(str)
    }

    // Định dạng tiền tệ về vnd
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }


    const handlePayment = async () => {
        const payload = {
            method: paymentType,
            amount: amount,
            details: paymentDetails
        }

        await onPayment(paymentType, payload)
    }

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-[#f5f5f5] rounded-lg shadow-lg px-20 py-12">
                <div className="mb-6">
                    <h2 className="text-3xl font-semibold mb-2 text-purple-900">Payment method</h2>
                </div>

                {/* Fee */}
                <div className="mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Thanh toán vé máy bay:</span>
                            <span className="font-semibold">{formatCurrency(amount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                                {passengerCount} hành khách × {formatCurrency(amount / passengerCount)}
                            </span>
                            {paymentStatus === 'processing' && (
                                <span className="text-red-600">
                                    Thời gian còn lại: {formatTime(timeLeft)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <RadioGroup
                    value={paymentType}
                    onValueChange={setPaymentType}
                    className="space-y-3"
                >
                    {/* credit card */}
                    <div className={`bg-white rounded-md shadow-lg p-4 ${paymentType === "CreditCard" ? 'bg-opacity-50 border border-blue-500' : 'bg-opacity-100'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <RadioGroupItem
                                    value="CreditCard"
                                    id="CreditCard"
                                />
                                <label htmlFor="CreditCard" className={`font-semibold ${paymentType === "CreditCard" ? 'text-purple-900' : 'text-black'}`}>Credit Card</label>
                            </div>

                            {/* logo */}
                            <div className="flex space-x-3">
                                <Image
                                    src={"/visa.png"}
                                    width={30}
                                    height={30}
                                />

                                <Image
                                    src={"/jcb.png"}
                                    width={25}
                                    height={25}

                                />

                                <Image
                                    src={"/bank.png"}
                                    width={25}
                                    height={25}
                                />
                            </div>
                        </div>


                        {/* content */}
                        {paymentType === "CreditCard" && (
                            <div className="container mx-auto p-2 grid md:grid-cols-2 grid-cols-1">
                                <div className="flex p-2">
                                    <form className="w-full space-y-4" onSubmit={handlePayment()}>
                                        <div className="w-full space-y-1.5 ">
                                            <label htmlFor="cardHolderName">Card Holder Name</label>
                                            <Input
                                                type="text"
                                                id="cardHolderName"
                                                value={cardHolderName}
                                                onChange={(e) => setCardHolderName(e.target.value)}
                                                placeholder="Card Holder Name"
                                            />
                                        </div>


                                        <div className="w-full space-y-1.5 ">
                                            <label htmlFor="cardNumber">Card Number</label>
                                            <Input
                                                type="text"
                                                id="cardNumber"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                placeholder="Card Number"
                                            />
                                        </div>

                                        <div className="sm:flex w-full sm:space-x-4 sm:space-y-0 space-y-3">
                                            <div className="space-y-1.5 flex-1">
                                                <label htmlFor="expiryDate">Expiry Date</label>
                                                <Input
                                                    type="month"
                                                    id="expiryDate"
                                                    value={cardExpiry}
                                                    onChange={(e) => setCardExpiry(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-1.5 flex-1">
                                                <label htmlFor="cvv">CVV Code</label>
                                                <Input
                                                    type="password"
                                                    id="cvv"
                                                    value={cardCvv}
                                                    onChange={(e) => setCardCvv(e.target.value)}
                                                    placeholder="***"
                                                />
                                            </div>
                                        </div>


                                        <Button
                                            type="submit"
                                            className="p-2 bg-orange hover:bg-red-600 text-white transition-colors duration-75 ease-linear rounded-xl w-[120px] text-md"
                                        >
                                            Thanh toán
                                            <ArrowRight className="w-4 h-4 text-center" />
                                        </Button>

                                    </form>
                                </div>

                                {/* visa */}
                                <div className="mt-3 md:mx-7 bg-[url('/bgvisa.jpg')] bg-cover bg-center bg-no-repeat md:w-auto md:h-1/2 w-full h-40 overflow-hidden rounded-lg">
                                    {/* tem */}
                                    <div className="px-5 py-3">
                                        <Image
                                            src={'/chip.png'}
                                            width={40}
                                            height={30}
                                        />

                                        <div className="mt-3 text-white font-semibold">
                                            {cardNumber}
                                        </div>

                                        <div className="mt-3 flex justify-between items-center">
                                            <div className="space-y-0.5">
                                                <p className="text-[12px] text-zinc-400">Card Holder Name</p>
                                                <h2 className="text-white uppercase tracking-tighter text-[15px]">{removeDiacritics(cardHolderName)}</h2>
                                            </div>


                                            <div className="space-y-0.5">
                                                <p className="text-[12px] text-zinc-400">Expiry Date</p>
                                                <h2 className="text-white uppercase tracking-tighter text-[15px]">{cardExpiry}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Bank Transfer */}
                    <div className={`bg-white rounded-md shadow-lg  p-4 ${paymentType === "BankTransfer" ? 'bg-opacity-50 border border-blue-500' : 'bg-opacity-100'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <RadioGroupItem
                                    value="BankTransfer"
                                    id="BankTransfer"
                                />
                                <label htmlFor="BankTransfer" className={`font-semibold ${paymentType === "BankTransfer" ? 'text-purple-900' : 'text-black'}`}>Bank Transfer</label>
                            </div>

                            <div className="flex space-x-3">
                                <Image
                                    src={"/bank1.png"}
                                    width={25}
                                    height={25}
                                    objectFit="cover"
                                />
                            </div>
                        </div>

                        {paymentType === "BankTransfer" && (
                            <div className="flex md:items-center items-start justify-between md:flex-row flex-col md:space-y-0 space-y-6 mt-2">
                                <div className="flex items-center">
                                    <Building2 className="h-6 w-6 mr-3 text-gray-600" />
                                    <div>
                                        <h4 className="font-medium">Chuyển khoản ngân hàng</h4>
                                        <p className="text-sm text-gray-500">Chuyển khoản qua QR Code hoặc số tài khoản</p>
                                    </div>
                                </div>

                                <Button variant="default" className="py-1 px-2" onClick={handlePayment}>
                                    Thanh toán
                                    <ChevronRight className="w-4 h-4"/>
                                </Button>
                            </div>
                        )}
                    </div>


                    {/* paypal */}
                    <div className={`bg-white rounded-md shadow-lg flex justify-between items-center p-4 ${paymentType === "Paypal" ? 'bg-opacity-50 border border-blue-500' : 'bg-opacity-100'}`}>
                        <div className="flex items-center space-x-4">
                            <RadioGroupItem
                                value="Paypal"
                                id="Paypal"
                            />
                            <label htmlFor="Paypal" className={`font-semibold ${paymentType === "Paypal" ? 'text-purple-900' : 'text-black'}`}>Paypal</label>
                        </div>

                        <div className="flex space-x-3">
                            <Image
                                src={"/paypal.png"}
                                width={25}
                                height={25}
                                objectFit="cover"
                            />
                        </div>

                    </div>
                </RadioGroup>


                <div className="flex justify-between mt-3">
                    <Button
                        onClick={onBack}
                        className="px-6 py-3 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200 ease-in-out"
                    >
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    )
}