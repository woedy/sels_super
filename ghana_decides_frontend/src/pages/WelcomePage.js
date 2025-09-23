import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import button_g from "../assets/images/button_g.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import useSound from 'use-sound';
import useTapSound from '../components/UseSound';







const WelcomePage = () => {


    const [dateTime, setDateTime] = useState(new Date());
    const playTapSound = useTapSound(0.5);




    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);





    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="text-black text-6xl font-black mb-1">
               Smart Election Ledger System
            </div>

            <div className="text-black text-5xl font-black mb-5">
               (SELS)
            </div>

            <div className="text-black text-4xl font-bold mt-4">
               Ghana Decides
            </div>
            <div className="text-black text-9xl font-black mb-4">
                2024
            </div>
            <div className="text-center bg-white px-3 py-1 rounded mb-4">
                <p className='font-bold'>Powered by SamaLTE</p>
            </div>

            <Link to="/login">
                <img className="h-20" onClick={()=>
                playTapSound()
                } src={button_g} alt="Button" />
            </Link>

            <div className="absolute top-10 right-10">
                <FontAwesomeIcon icon={faBell} className="text-2xl text-white" />
            </div>
            <div className="absolute bottom-10 left-10 p-2 rounded">
                <p className='font-bold text-4xl' style={{ textShadow: '3px 3px 0 white, -2px -2px 0 white, 3px -3px 0 white, -3px 3px 0 white' }}>
                    <span>{dateTime.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    <br />
                    <span>{dateTime.toLocaleTimeString()}</span>
                </p>
            </div>

        </div>
    );
};

export default WelcomePage;
