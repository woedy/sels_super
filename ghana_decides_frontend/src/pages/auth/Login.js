import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import CustomButton from '../../components/CustomButton';
import { Link } from 'react-router-dom';
import DateTimeDisplay from '../../components/DateTimeDisplay';

const LoginPage = () => {

    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="text-black text-5xl font-black mb-1">
                Login As
            </div>

            <br />

            <div className='flex gap-4 mb-10'>
                <CustomButton to="/login-data-admin/">Data Admin</CustomButton>
                <CustomButton to="/login-presenter/">Presenter</CustomButton>
            </div>

            <Link to='/register'>
                <div className="w-60 h-10 bg-black backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                    <p className="text-white text-xl font-bold p-2 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                        Register
                    </p>
                </div>
            </Link>

            <div className="absolute top-10 right-10">
                <FontAwesomeIcon icon={faBell} className="text-2xl text-white" />
            </div>

            <DateTimeDisplay />
        </div>
    );
};

export default LoginPage;
