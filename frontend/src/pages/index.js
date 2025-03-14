import React from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';
import Hero from '@/components/hero';
import Destination from '@/components/destination';
import About from '@/components/about';
import Review from '@/components/review';
import Benefit from '@/components/benefit';

function Home() {
    useEffect(() => {
        AOS.init({
            duration: 1500,
        });
    }, []);
    return (
        <div>
            <Hero />
            <Destination />
            <About />
            <Review />
            <Benefit />
        </div>

    );
}

export default Home;