'use client'

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Image from "next/image";
import "react-multi-carousel/lib/styles.css"
import { Card } from "./ui/card";
import Link from "next/link";

import {
    MdStar,
    MdCheck,
    MdPeopleOutline,
    MdLocationPin,
    MdArrowRightAlt,
} from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { WiTime3 } from "react-icons/wi";

import flights from "@/data/featureFlight.json"
import { Button } from "./ui/button";


const Carousel = dynamic(() => import("react-multi-carousel"), { ssr: false })
const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 4,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

export default function Destination() {

    const [visibleCount, setVisibleCount] = useState(4)
    const [expanded, setExpanded] = useState(false);

    // click more info
    const handleToggle = () => {
        if (expanded) {
            setVisibleCount(4);
        } else {
            setVisibleCount(flights.length);
        }
        setExpanded(!expanded); // Đảo trạng thái
    }


    return (
        <>
            <div className="lg:mt-60 mt-10 "
                data-aos="fade-down"
            >
                <div className="max-w-[1400px] px-6 mx-auto text-center ">
                    <h4 className="font-bold lg:text-[50px] text-[30px] px-4">
                        Các chuyến Bay Phổ Biến
                    </h4>

                    {/* Flights List */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {flights.slice(0, visibleCount).map((flight) => (
                            <div key={flight.id} className="relative cursor-pointer h-[400px] text-left rounded-md overflow-hidden group">
                                <Image
                                    src={flight.image}
                                    alt={`${flight.from} đến ${flight.to}`}
                                    width={600}
                                    height={400}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 rounded-md"
                                />

                                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                                    {flight.position}
                                </div>

                                <div className="absolute bottom-0 w-full h-1/2 bg-orange/70 p-4">
                                    <div className="text-white">
                                        <h4 className="text-lg font-semibold">
                                            {flight.from} đến {flight.to}
                                        </h4>
                                        <p className="text-sm">{flight.date}</p>
                                    </div>

                                    <div className=" text-white text-right absolute right-4 bottom-4">
                                        <div className="text-sm">Từ</div>
                                        <div className="text-xl font-bold">{flight.price} VND*</div>
                                        <div className="text-sm">{flight.views}</div>
                                        <div className="text-sm">Một chiều / Phổ thông</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nút xem thêm */}
                    <div className="mt-6 p-2 text-center">
                        <Button
                            variant="default"
                            className="bg-orange/90 text-white px-6 py-3 rounded-md text-lg"
                            onClick={handleToggle}
                        >
                            {expanded ? "Ẩn bớt" : "Xem thêm"}
                        </Button>
                    </div>
                </div>
            </div>


            {/* More info */}
            <div className="bg-[url(/bg-line-bird.png)] bg-no-repeat py-16">
                <div className="flex lg:flex-row flex-col max-w-[1400px] mx-auto gap-8">
                    <div className="flex-1 px-6 py-2" data-aos="fade-down">
                        <Image
                            src={"/image-6.jpg"}
                            alt="moreinfo"
                            width={600}
                            height={600}
                            priority
                            className="object-cover w-full h-full"
                        />

                        <div className="absolute top-4 right-4">
                            <p className="text-orange font-semibold text-[80px]">10%</p>
                            <p className="text-[50px] font-semibold -mt-8">Giảm giá</p>
                        </div>

                        <button className="bg-white shadow-md px-12 py-4 absolute left-4 top-1/2 rounded-xl">
                            <p className="text-gray text-xs font-medium">Đặt chuyến bay ngay</p>
                            <p className="font-semibold text-lg">66888000</p>
                        </button>
                    </div>

                    <div className="flex-1 px-6 py-2" data-aos="fade-up">
                        <p className="text-orange lg:text-[20px] text-[15px]">Hãy đến với chúng tôi</p>
                        <h4 className="font-bold lg:text-[50px] text-[30px] py-4">Tận hưởng chuyến bay của bạn với QAirline</h4>
                        <p className="text-[#757783] leading-8 mb-8">
                            Có nhiều lựa chọn chuyến bay, đảm bảo an toàn và thoải mái cho bạn.
                        </p>
                        <span className="flex items-center gap-4 py-2 font-medium">
                            <MdCheck className="bg-orange text-white rounded-xl" /> Đầu tư vào hành trình khám phá của chính bạn.
                        </span>
                        <span className="flex items-center gap-4 py-2 font-medium">
                            <MdCheck className="bg-orange text-white rounded-xl" /> Đồng hành cùng bạn trên mọi hành trình đầy cảm xúc.
                        </span>
                        <span className="flex items-center gap-4 py-2 font-medium">
                            <MdCheck className="bg-orange text-white rounded-xl" /> Trải nghiệm dịch vụ đẳng cấp, mang đến sự hài lòng tuyệt đối.
                        </span>
                        <div className="mt-8">
                            <Link href="/">
                                <Button variant="default" className="bg-orange text-white text-xs font-bold rounded-md px-8 h-12">
                                    ĐẶT CHUYẾN BAY NGAY
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
