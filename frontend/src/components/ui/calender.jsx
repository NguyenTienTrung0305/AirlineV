import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function CustomCalendar({
    className,
    markerPreDate,
    markerNextDate,
    ...props // truyền các useState như selected={departureDate} và onSelect={setDepartureDate}, các sự kiện như selected và onSelect sẽ truyền giá trị về cho 2 biến này
}) {
  
    // Hàm kiểm tra ngày bị disable
    const isDateDisabled = (date) => {
        return (
            (markerPreDate && date < markerPreDate) ||
            (markerNextDate && date > markerNextDate)
        );
    };

    return (
        <div className={cn("relative p-4 bg-white rounded-lg shadow-md", className)}>
            <DatePicker
                filterDate={(date) => !isDateDisabled(date)} // Disable ngày ngoài phạm vi
                dayClassName={(date) =>
                    cn(
                        "p-1", // Padding cho ô ngày
                        isDateDisabled(date)
                            ? "text-gray-400 cursor-not-allowed " // Ô disable: chữ xám, không nhấp được
                            : "text-black hover:bg-gray-200 " // Ô bình thường: chữ đen, hover xám
                    )
                }
                calendarClassName="w-full text-center "
                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                    <div className="flex justify-between items-center px-2 py-1">
                        <button onClick={decreaseMonth} className="p-1">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-thin">
                            {date.toLocaleString("default", { month: "long", year: "numeric" })} {/*chuyển đổi đối tượng Date thành chuỗi dạng "March 2025" (hoặc tương tự tùy locale) */}
                        </span>
                        <button onClick={increaseMonth} className="p-1">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
                inline // Hiển thị lịch luôn (như react-calendar)
                {...props}
            />
        </div>
    );
}

export { CustomCalendar };