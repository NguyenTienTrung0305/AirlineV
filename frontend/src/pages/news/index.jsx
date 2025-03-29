import React, { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import "react-multi-carousel/lib/styles.css";
import newsdata from "@/data/news.json"
import { FeaturedCard2, Card2 } from '@/components/Card2';

const Carousel = dynamic(() => import("react-multi-carousel"), { ssr: false })


const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1280 },
        items: 1,
    },
    desktop: {
        breakpoint: { max: 1280, min: 1024 },
        items: 1,
    },
    tablet: {
        breakpoint: { max: 1024, min: 640 },
        items: 1,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 1,
    },
};


export default function News() {
    return (
        <main className='container mx-auto px-4 py-8'>
            <section className='mb-12'>
                <h2 className='text-3xl font-bold mb-6 text-teal-600'>
                    Bài viết nổi bật
                </h2>
                <Carousel
                    swipeable={true}
                    draggable={false}
                    showDots={true}
                    dotListClass="custom-dot-list-style"
                    responsive={responsive}
                    ssr={true}
                    autoPlay={true}
                    autoPlaySpeed={3000}
                    infinite
                    keyBoardControl={true}
                    customTransition='all .5s'
                    transitionDuration={500}
                    removeArrowOnDeviceType={['tablet', 'mobile']}
                    containerClass='carousel-news'
                >
                    {newsdata.map((article, index) => (
                        <FeaturedCard2 key={index} {...article} />
                    ))}
                </Carousel>
            </section>

            {/* Phần Tin Tức Mới Nhất */}
            <section>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                    Tin tức mới nhất
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {newsdata.map((article, index) => (
                        <Card2 key={index} {...article} />
                    ))}
                </div>
            </section>
        </main>
    )
}