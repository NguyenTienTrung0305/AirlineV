"use client";

import Image from "next/image";
import { MdArrowCircleRight, MdPerson } from "react-icons/md";
import { RiFlightTakeoffFill } from "react-icons/ri";
import { GiRuleBook } from "react-icons/gi";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-multi-carousel/lib/styles.css";
import { Button } from "./ui/button";
import { useState } from "react";
import featuredArticlesData from "@/data/featuredArticles.json";

const Carousel = dynamic(() => import("react-multi-carousel"), { ssr: false });

const responsive = {
    large: {
        breakpoint: { max: 4000, min: 1280 },
        items: 3, // Sửa từ "item" thành "items"
    },
    medium: {
        breakpoint: { max: 1280, min: 890 },
        items: 2,
    },
    small: {
        breakpoint: { max: 890, min: 0 },
        items: 1,
    },
};

// Sửa NewsCard
const NewsCard = ({ ...props }) => (
    <div className="relative flex flex-col items-center pt-12">
        <div className="relative w-[400px] h-[500px] overflow-hidden rounded-b-lg ml-8">
            {/* Ảnh nền */}
            <Image
                src={props.image}
                alt={props.title || "Bài viết"}
                width={400}
                height={500}
                className="rounded-t-lg object-cover hoverImg cursor-pointer"
            />

            {/* Khu vực nội dung */}
            <div className="absolute top-1/3 bg-slate-50 rounded-2xl w-full h-[350px] z-50 border border-gray-200 shadow-lg p-6">
                {/* Tác giả */}
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <p className="text-sm text-gray-600">{props.author}</p>
                </div>

                {/* Tiêu đề */}
                <h3 className="text-2xl font-bold text-black mt-4 line-clamp-2">{props.title}</h3>

                {/* Mô tả */}
                <p className="text-md text-gray-500 mt-2 line-clamp-3">{props.description}</p>

                {/* Nút Đọc thêm */}
                <Link href={`/news/${props.slug}`}>
                    <button className="absolute bottom-[20%] mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        {props.buttonText}
                    </button>
                </Link>
            </div>
        </div>
    </div>
);

export default function Benefit() {
    const [articles] = useState(featuredArticlesData);
    return (
        <div>
            {/* Giới thiệu */}
            <div className="lg:flex">
                <div className="xl:w-1/2 xl:block hidden" data-aos="fade-right">
                    <Image
                        src="/bg-2.jpg"
                        alt="Background"
                        width={900}
                        height={900}
                        className="h-full"
                    />
                </div>

                <div className="relative bg-[url(/bg-map-2.png)] bg-[#313041] bg-right-bottom bg-contain py-16 px-20 xl:w-1/2">
                    <div className="absolute lg:w-3 w-0 bg-orange left-0 rounded-r-[10px] top-[120px] bottom-[120px]"></div>
                    <div className="lg:w-[60%]">
                        <p className="text-xl text-orange" data-aos="fade-up">
                            Danh sách lợi ích của chúng tôi
                        </p>
                        <h4 className="text-white lg:text-[50px] text-[30px] py-4" data-aos="fade-up">
                            Tại sao chọn AirlineV
                        </h4>
                        <p className="text-gray leading-8" data-aos="fade-down">
                            Chúng tôi tự hào mang đến trải nghiệm đặt vé máy bay trực tuyến tiện lợi và an toàn,
                            với những tính năng vượt trội và dịch vụ khách hàng tận tâm, giúp bạn dễ dàng tìm kiếm
                            chuyến bay tốt nhất với giá cả hợp lý.
                        </p>

                        <div className="flex flex-row gap-8 py-16 items-center" data-aos="fade-up">
                            <span>
                                <RiFlightTakeoffFill className="text-orange text-5xl" />
                            </span>
                            <span>
                                <h6 className="text-white text-xl">Chuyên nghiệp và được chứng nhận</h6>
                                <p className="text-gray leading-8 py-4">
                                    Chúng tôi hợp tác với các hãng hàng không uy tín và đã được chứng nhận, đảm bảo
                                    chuyến bay của bạn luôn an toàn và chất lượng. Đội ngũ chuyên nghiệp luôn hỗ trợ
                                    bạn 24/7.
                                </p>
                            </span>
                        </div>

                        <div className="flex flex-row gap-8 py-16 items-center" data-aos="fade-up">
                            <span>
                                <GiRuleBook className="text-orange text-5xl" />
                            </span>
                            <span>
                                <h6 className="text-white text-xl">Đặt vé ngay lập tức</h6>
                                <p className="text-gray leading-8 py-4">
                                    Dễ dàng lên lịch trình và đặt vé chỉ trong vài bước. Nhận xác nhận tức thì và tận
                                    hưởng những ưu đãi hấp dẫn khi đặt vé trên nền tảng của chúng tôi.
                                </p>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần tin tức */}
            <div className="max-w-[1400px] mx-auto py-20 px-6" data-aos="fade-up">
                {/* Header */}
                <div className="flex lg:flex-row flex-col lg:justify-between">
                    <span className="lg:text-left text-center">
                        <p className="text-2xl text-orange pb-4">Từ trang tin tức</p>
                        <p className="lg:text-[50px] text-3xl text-textColor font-semibold">
                            Tin tức và Bài viết
                        </p>
                    </span>
                    <Link href="/news" className="lg:mt-0 mt-6 lg:text-left text-center">
                        <Button variant="default" className="bg-orange p-4">
                            XEM TOÀN BỘ
                        </Button>
                    </Link>
                </div>

                {/* Carousel */}
                <Carousel
                    partialVisible={false}
                    swipeable
                    draggable={false}
                    responsive={responsive}
                    ssr={false}
                    infinite
                    autoPlay
                    arrows
                    keyBoardControl
                    itemClass="carouselItem"
                >
                    {articles.map((article) => (
                        <NewsCard key={article.slug} {...article} /> // Sửa key từ index thành slug
                    ))}
                </Carousel>
            </div>


            {/* is participated  */}
            <div className="bg-red-100 w-full" data-aos="fade-down">
                <div className="lg:flex block max-w-[1400px] mx-auto pt-14">
                    <div className="lg:w-1/2 w-full flex flex-col px-6">
                        <p className="text-orange xl:text-2xl text-xl">Tham gia với chúng tôi</p>
                        <h1 className="xl:text-[50px] text-[30px] font-bold text-zinc-700">Bạn đã là thành viên chưa?</h1>
                        <p className="text-gray font-semibold xl:text-xl">Tham gia với chúng tôi, các thành viên của chúng tôi có thể tiết kiệm lên đến 50%</p>

                        <div className="flex gap-4 pt-6">
                            <Link
                                href="/login"
                            >
                                <button className="flex bg-orange text-white hover:text-black p-3 gap-3 items-center justify-center rounded-sm w-[140px]">
                                    <MdArrowCircleRight size={20} />
                                    Đăng nhập
                                </button>
                            </Link>

                            <Link
                                href="/signup"
                            >
                                <button className="flex bg-white text-black hover:bg-orange p-3 gap-3 items-center justify-center rounded-sm w-[140px]">
                                    <MdArrowCircleRight size={20} />
                                    Đăng ký
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex justify-center lg:w-1/2 w-full lg:mt-0 mt-14">
                        <Image
                            src="/image-app.png"
                            alt="Image description"
                            width={500}
                            height={500}
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}