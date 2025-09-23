import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import button_g from "../../../assets/images/button_g.svg";
import { Link, useNavigate } from 'react-router-dom';
import BackgroundImage from '../../../components/BackgroundImage';
import DateTimeDisplay from '../../../components/DateTimeDisplay';
import React, { useState, useEffect } from 'react';

const RegisterDataAdminResendVerify = () => {

    const [verificationCode, setVerificationCode] = useState('');





    const navigate = useNavigate();


    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {
        // Your handleSubmit code
    };

    

    return (
        <BackgroundImage imageUrl={`${process.env.PUBLIC_URL}/ghana_decides_back.png`}>
            <div className="relative flex flex-col items-center justify-center h-full">
                <div className="text-black text-5xl font-black mb-1">
                    Register - Data Admin
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="border-b border-gray-900/10 pb-12 bg-black bg-opacity-50 backdrop-blur-lg px-10 py-10 my-10 rounded-lg" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                        {emailError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {emailError}</span>
                            </div>
                        )}
                        <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-6">
                            <div className="sm:col-span-12">
                                <label htmlFor="verification" className="block text-sm font-medium leading-6 text-white">
                                    Resend Verification Code
                                </label>
                                <div className="mt-2 h-full">
                                    <p className='text-white'>Resend email verification to sandramensah@gmail.com?</p>

                                    <div className='flex items-center justify-center'>

                                    <Link to="/register-data-resend-verify/">
                                        <div className="w-80 h-10 rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                                Send Code
                                            </p>
                                        </div>
                                    </Link>
                                    </div>



                                </div>

                            </div>
                        </div>
                    </div>
        
                </form>


                <div className="absolute top-10 right-10">
                    <FontAwesomeIcon icon={faBell} className="text-2xl text-white" />
                </div>
                <DateTimeDisplay />
            </div>
        </BackgroundImage>
    );
};

export default RegisterDataAdminResendVerify;




