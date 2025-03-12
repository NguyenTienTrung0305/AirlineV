import React from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';
import Hero from '@/components/hero';
import Destination from '@/components/destination';
import About from '@/components/about';
import Review from '@/components/review';

function Home() {
    useEffect(() => {
        AOS.init({
            duration: 1500,
        });
    }, []);
    return (
        <div>
            <Hero/>
            <Destination/>
            <About/>
            <Review/>    
        </div>

    );
}

export default Home;