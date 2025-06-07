import { ArrowLeft, Check, Download, Home, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useState, useRef } from "react";
import { Dialog, DialogClose, DialogContent, DialogOverlay } from "../ui/dialog";
import { FlightTicket } from "./flight-ticket";
import jsPDF from "jspdf";
import domtoimage from 'dom-to-image'

export function CheckInConfrm({
    flight,
    passengerList,
    onBack,
    onHome
}) {

    const [showBoardingPass, setShowBoardingPass] = useState(false)
    const [currentTicket, setCurrentTicket] = useState(null)
    const ticketRef = useRef()


    const renderTickets = (passengers, flight, title) => (
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-orange mb-4">{title}</h2>
            {passengers.map((passenger, index) => (
                <Card key={passenger.cccd} className="mb-4">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-zinc-500">Hành khách</p>
                                <p className="text-lg font-semibold">{passenger.name}</p>
                            </div>

                            <div>
                                <p className="text-sm text-zinc-500">Ghế</p>
                                <p className="text-lg font-semibold">{passenger.seat || "Chưa chọn"}</p>
                            </div>
                        </div>


                        {/* button */}
                        <div className="mt-4 flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setCurrentTicket({ passenger, flight })
                                    setShowBoardingPass(true)
                                }}
                                className="gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Xem vé
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setCurrentTicket({ passenger, flight })
                                    handleDownload()
                                }}
                                className="gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Tải về
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )


    // download pdf
    const handleDownload = async () => {
        if (ticketRef.current) {
            try {
                const dataUrl = await domtoimage.toPng(ticketRef.current, {
                    bgcolor: '#ffffff',
                    width: ticketRef.current.offsetWidth,
                    height: ticketRef.current.offsetHeight,
                    style: {
                        transform: 'scale(1)',
                        transformOrigin: 'top left'
                    }
                });

                console.log('Image generated, length:', dataUrl.length)

                const pdf = new jsPDF()
                const img = new Image()

                img.onload = function () {
                    const imgWidth = 150;
                    const imgHeight = (img.height * imgWidth) / img.width
                    pdf.addImage(dataUrl, 'PNG', 30, 30, imgWidth, imgHeight)
                    pdf.save('ticket.pdf')
                };

                img.src = dataUrl;

            } catch (error) {
                console.error('Error with dom-to-image:', error);
            }
        }
    }

    const handlePrint = async () => {
        if (ticketRef.current) {
            try {
                const printWindow = window.open('', '_blank');

                // Lấy HTML content của vé
                const ticketHTML = ticketRef.current.outerHTML

                // Tạo HTML document cho trang in
                const printDocument = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>VÉ MÁY BAY - ${currentTicket?.passenger?.name || ''}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @media print {
                            body {
                                margin: 0;
                                padding: 20px;
                                background: white;
                            }
                            .no-print {
                                display: none !important;
                            }
                            
                            .ticket-container {
                                max-width: 400px;
                                margin: 0 auto;
                                page-break-inside: avoid;
                            }
                        }
                        
                        @page {
                            size: A4;
                            margin: 1cm;
                        }
                        
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.5;
                            color: #333;
                            background: white;
                            padding: 20px;
                        }
                        
                        .print-header {
                            text-align: center;
                            margin-bottom: 30px;
                            border-bottom: 2px solid #e5e7eb;
                            padding-bottom: 20px;
                        }
                        
                        .print-header h1 {
                            color: #236C5B;
                            font-size: 28px;
                            font-weight: bold;
                            margin: 0;
                        }
                        
                        .print-header p {
                            color: #26846E;
                            margin: 10px 0 0 0;
                            font-size: 14px;
                            text-transform: uppercase;
                        }
                        
                        .ticket-container {
                            max-width: 400px;
                            margin: 0 auto;
                        }
                        
                        .print-footer {
                            text-align: center;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #e5e7eb;
                            color: #6b7280;
                            font-size: 12px;
                        }
                        

                        svg {
                            display: inline-block;
                            vertical-align: middle;
                        }
                    </style>
                </head>
                <body>
                    <div class="print-header">
                        <h1>AirlineV</h1>
                        <p>Vé điện tử - Vui lòng xuất trình khi lên máy bay</p>
                    </div>
                    
                    <div class="ticket-container">
                        ${ticketHTML}
                    </div>
                    
                    <div class="print-footer">
                        <p>Cảm ơn quý khách đã chọn AirlineV</p>
                        <p>Vui lòng có mặt tại sân bay trước giờ bay ít nhất 2 tiếng</p>
                        <p>In lúc: ${new Date().toLocaleString('vi-VN')}</p>
                    </div>
                    
                    <script>
                        // Tự động in khi trang load xong
                        window.onload = function() {
                            setTimeout(function() {
                                window.print()

                                // Đóng cửa sổ sau khi in hoặc hủy in
                                window.onafterprint = function() {
                                    window.close()
                                }
                            }, 500)
                        }
                    </script>
                </body>
                </html>
            `;

                // Ghi HTML vào cửa sổ mới
                printWindow.document.write(printDocument)
                printWindow.document.close()

            } catch (error) {
                console.error('Lỗi khi in vé:', error)
                alert('Có lỗi xảy ra khi in vé. Vui lòng thử lại.')
            }
        } else {
            alert('Không tìm thấy thông tin vé để in')
        }
    }


    return (
        <div className="w-full bg-slate-100 rounded-md">
            <div className="max-w-4xl mx-auto p-4 relative z-10 shadow-lg">
                <h1 className="text-2xl text-orange font-semibold mb-6">Xác nhận làm thủ tục</h1>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Quý khách đã làm thủ tục lên máy bay thành công</h2>
                                <p className="text-zinc-600">
                                    Quý khách đã làm thủ tục thành công. Vé máy bay của Quý khách nên được lưu trên máy hoặc in ra. Tại
                                    sân bay, Quý khách vui lòng kiểm tra lại thông tin về cửa ra máy bay.
                                </p>
                            </div>
                        </div>


                    </CardContent>
                </Card>

                {renderTickets(passengerList, flight, "Chuyến đi")}


                {/* Watch ticket */}
                <Dialog open={showBoardingPass} onOpenChange={setShowBoardingPass}>
                    <DialogOverlay />
                    <DialogContent className="sm:max-w-md border bg-slate-300">
                        <div ref={ticketRef}>
                            {currentTicket && (
                                <FlightTicket
                                    passengerName={currentTicket.passenger.name}
                                    flightCode={currentTicket.flight.flightCode}
                                    flightDate={currentTicket.flight.flightDate}
                                    departureTime={currentTicket.flight.departureTime}
                                    arrivalTime={currentTicket.flight.arrivalTime}

                                    departureCity={currentTicket.flight.departureCity}
                                    arrivalCity={currentTicket.flight.arrivalCity}

                                    seat={currentTicket.passenger.seat || "Chưa chọn"}

                                />
                            )}
                        </div>

                        {/* button */}
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
                                <Download className="w-4 h-4" />
                                Tải về
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                                <Printer className="w-4 h-4" />
                                In vé
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={onBack} className="gap-2 p-1 w-auto">
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại
                    </Button>
                    <Button variant="orange" onClick={onHome} className="gap-2 p-1 w-auto">
                        <Home className="w-4 h-4" />
                        Về trang chính
                    </Button>
                </div>
            </div>
        </div>
    )
}