import dynamic from "next/dynamic";
import Image from "next/image";
import "react-multi-carousel/lib/styles.css";
import { MdStar } from "react-icons/md";

const Carousel = dynamic(() => import("react-multi-carousel"), { ssr: false });

const responsive = {
    large: {
        breakpoint: { max: 4000, min: 1024 }, // Màn hình lớn (PC)
        items: 3,
    },
    medium: {
        breakpoint: { max: 1024, min: 768 }, // Tablet
        items: 2,
    },
    small: {
        breakpoint: { max: 768, min: 0 }, // Điện thoại
        items: 1,
    },
};


const responsives = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 2000 },
        items: 5,
    },
    tablet: {
        breakpoint: { max: 2000, min: 1300 },
        items: 4,
    },
    smtablet: {
        breakpoint: { max: 1300, min: 1000 },
        items: 3,
    },
    mobile: {
        breakpoint: { max: 1000, min: 600 },
        items: 2,
    },
    smmobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1,
    },
};

const Card = ({ image, name, position, review, rating }) => (
    <div className="flex flex-col items-center">
        <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden">
            <Image
                src={image}
                alt={name}
                layout="fill" // Sử dụng layout fill để hình ảnh phủ đầy container
                objectFit="cover" // Đảm bảo hình ảnh không bị méo, tự động crop vừa khung
                className="rounded-full"
            />
        </div>
        <div className="shadow-lg rounded-lg mt-10 bg-amber-100 p-8 text-center">
            <span className="flex justify-center">
                {[...Array(rating)].map((ele, index) => (
                    <MdStar key={index} className="text-[#ffa801] text-xl" />
                ))}
            </span>
            <p className="text-[#757783] text-lg leading-8 py-4">{review}</p>
            <p className="text-textColor text-xl font-semibold">{name}</p>
            <p className="text-orange py-2 uppercase">{position}</p>
        </div>
    </div>
);


export default function Review() {
    return (
        <div>
            <div className="bg-[url(/bg-plane-bird.png)] bg-contain bg-bottom bg-no-repeat relative z-10" data-aos="fade-up">
                <div className="max-w-[1200px] xl:px-0 px-6 mx-auto text-center pt-16">
                    <p className="text-orange text-xl pb-2">
                        Đánh giá từ những người đã trải nghiệm
                    </p>
                    <h4 className="lg:text-[50px] text-[30px] font-bold">
                        Họ đã nói những gì về chúng tôi?
                    </h4>
                    <div className="pt-10">
                        <Carousel
                            partialVisible={false}
                            swipeable={true}
                            draggable={true}
                            responsive={responsive}
                            ssr={false}
                            infinite
                            autoPlay
                            arrows
                            keyBoardControl
                            itemClass="carouselItem flex justify-center pl-9"
                        >
                            <Card
                                image="/AvatarUser/Mr-P.jpg"
                                name="Mr-P"
                                position="Khách hàng thân thiết"
                                review="Chuyến bay của anh và gia đình đi chơi rất thuận lợi. May là anh đặt vé bên em. Bên em tư vấn chọn chuyến cho anh xong lại check in online cho anh nên cả nhà được ngồi gần nhau."
                                rating={5}
                            />
                            <Card
                                image="/AvatarUser/chu_huyen.jpg"
                                name="Bạn Chu Huyền "
                                position="Khách hàng thân thiết"
                                review="Alo, mình và gia đình vừa về. Cảm ơn bên bạn đặt vé cho mình nhé! Cả nhà đi vui lắm bạn ạ. May là bạn tư vấn cho mình giờ vì nhà mình có trẻ nhỏ. Chuyến bay chuẩn giờ, chỗ ngồi đẹp."
                                rating={5}
                            />
                            <Card
                                image="/AvatarUser/Mr-cat.jpg"
                                name="Mrs-cat"
                                position="Khách hàng mới"
                                review="Cô vừa về đến nhà. Chuyến bay tốt lắm cháu ạ! Chuẩn giờ, bay máy bay to. Con cô bảo đặt được vé giá tốt mà giờ bay cũng rất đẹp. Lần sau lại đặt vé cho cô nhé!"
                                rating={5}
                            />
                            <Card
                                image="/AvatarUser/giang.jpg"
                                name="Chị Giang"
                                position="Khách hàng mới"
                                review="Lần đầu chị đặt vé bay đi nước ngoài bên em và cảm thấy vô cùng hài lòng! Chị rất cảm ơn bên em tư vấn cho chị chuyến bay, giờ bay đẹp, thời gian nối chuyến hợp lý, không bị mệt."
                                rating={5}
                            />
                            <Card
                                image="/AvatarUser/john.jpg"
                                name="Anh John"
                                position="Khách hàng quôc tế"
                                review="I have leg pain, so I often need to choose a comfortable seat. Your service is excellent! You booked me a ticket on a large, wide-body plane, and I’m very satisfied!"
                                rating={5}
                            />
                        </Carousel>
                    </div>
                </div>
            </div>
            {/*  */}
            <div className="pb-24 pt-80 -mt-40  bg-[url(/bg-map.png)] bg-[#faf5ee] bg-contain mx-auto" data-aos="fade-left">
                <Carousel
                    partialVisible={false}
                    swipeable={true}
                    draggable={true}
                    responsive={responsives}
                    ssr={false}
                    infinite
                    autoPlay
                    arrows
                    keyBoardControl
                    itemClass="carouselItem flex justify-center pl-9"
                >
                    {[
                        "/post-1.jpg",
                        "/post-2.jpg",
                        "/post-3.jpg",
                        "/post-4.jpg",
                        "/post-5.jpg",
                    ].map((ele, index) => (
                        <div
                            key={index}
                            className="relative w-[300px] h-[300px]"
                        >
                            <Image
                                src={ele}
                                alt={`Post ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg hoverImg"
                            />
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}