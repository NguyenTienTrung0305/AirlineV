'use client'
import dynamic from "next/dynamic";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { GiDeer, GiHangGlider } from "react-icons/gi";
import { CiFlag1 } from "react-icons/ci";
import { MdOutlineParagliding } from "react-icons/md";
import { FaPlaneDeparture } from 'react-icons/fa';
import { MdFlight } from 'react-icons/md';
import { GiPriceTag } from 'react-icons/gi';
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { Button } from "./ui/button";

export default function About() {
    return (
        <>
            <div className="bg-[url(/bg-1.jpg)] w-full bg-center bg-no-repeat bg-cover">
                <div className="flex flex-col lg:flex-row gap-12 px-6 mx-auto max-w-[1400px]">
                    {/* introduce */}
                    <div className="lg:w-1/2 w-full lg:mt-12 mt-16 lg:text-left text-center">
                        <span data-aos="fade-up-right">
                            <Button variant="destructive" className="animate-bounce p-8 bg-orange">
                                <FaPlay className="text-white" />
                            </Button>
                            <p className="text-orange text-xl mb-2">
                                Bạn đã sẵn sàng để bay chưa ?
                            </p>
                        </span>
                        <p
                            className="lg:text-[50px] leading-normal text-3xl font-bold text-white lg:pb-0 pb-4"
                            data-aos="fade-up-right"
                        >
                            AirlineV là nền tảng đặt vé máy bay hàng đầu thế giới
                        </p>
                    </div>


                    <div className="grid md:grid-cols-2 grid-cols-1 gap-2 my-12"
                        data-aos="fade-up-right"
                    >
                        <div className="border border-gray rounded-lg p-10 flex flex-col items-center gap-4 text-orange hover:bg-orange hover:text-white hover:border-transparent transition-bg duration-500"
                            data-aos="fade-down-right"
                        >
                            <FaPlaneDeparture className="text-2xl w-20 h-20" />
                            <p className="text-white text-xl font-semibold">Flight Booking</p>
                        </div>

                        <div className="border border-gray rounded-lg p-10 flex flex-col items-center gap-4 text-orange hover:bg-orange hover:text-white hover:border-transparent transition-bg duration-500"
                            data-aos="fade-down-right"
                        >
                            <MdFlight className="text-2xl w-20 h-20" />
                            <p className="text-white text-xl font-semibold">Flight Status</p>
                        </div>

                        <div className="border border-gray rounded-lg p-10 flex flex-col items-center gap-4 text-orange hover:bg-orange hover:text-white hover:border-transparent transition-bg duration-500"
                            data-aos="fade-down-right"
                        >
                            <GiPriceTag className="text-2xl w-20 h-20" />
                            <p className="text-white text-xl font-semibold">Travel Detail</p>
                        </div>

                        <div className="border border-gray rounded-lg p-10 flex flex-col items-center gap-4 text-orange hover:bg-orange hover:text-white hover:border-transparent transition-bg duration-500"
                            data-aos="fade-down-right"
                        >
                            <AiOutlineCheckCircle className="text-2xl w-20 h-20" />
                            <p className="text-white text-xl font-semibold">Check-in Online</p>
                        </div>
                    </div>

                </div>

                {/* partner */}
                <div
                    className="bg-[url(/bg-line.png)] bg-contain bg-bottom bg-orange py-[100px] "
                    data-aos="fade-down"
                >
                    <div className="lg:flex gap-16 max-w-[1400px] xl:px-0 px-6 mx-auto">
                        <p className="text-[40px] font-bold text-white whitespace-pre lg:w-1/3 w-full text-center">
                            Đối tác của chúng tôi
                        </p>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-8 w-full justify-items-center lg:mt-auto mt-6">
                            <Image className="max-w-full h-auto" src="/vietnam_airline.png" alt="vietnam airline logo" width={350} height={350} loading="lazy" />
                            <Image className="max-w-full h-auto" src="/vietjet.png" alt="vietjet logo" width={350} height={350} loading="lazy" />
                            <Image className="max-w-full h-auto" src="/china_airline.png" alt="china airline logo" width={350} height={350} loading="lazy" />
                            <Image className="max-w-full h-auto" src="/hongkong_airline.png" alt="hongkong airline logo" width={350} height={350} loading="lazy" />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}