import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import button_g from "../../../assets/images/button_g.svg";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { baseUrl } from '../../../Constants';
import BackgroundImage from '../../../components/BackgroundImage';
import DateTimeDisplay from '../../../components/DateTimeDisplay';
import React, { useState, useEffect } from 'react';

const RegisterPresenterVerify = () => {

    const location = useLocation();
    const { email } = location.state; // Assuming email is passed as state from the previous page

    const [verificationCode, setVerificationCode] = useState('');

    const navigate = useNavigate();


    const [inputError, setInputError] = useState('');
    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}api/accounts/verify-user-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, email_token: verificationCode }),
            });
            if (response.ok) {
                // Email verified successfully
                navigate('/register-presenter-successful');
            } else {
                // Handle error
                const errorData = await response.json();
                setInputError("Invalid Code");
            }
        } catch (error) {
            // Handle network error
            console.error('Error:', error);
        }
        setLoading(false);
    };

    return (
        <BackgroundImage imageUrl={`${process.env.PUBLIC_URL}/ghana_decides_back.png`}>
            <div className="relative flex flex-col items-center justify-center h-full">
                <div className="text-black text-5xl font-black mb-1">
                    Register - Presenter
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="border-b border-gray-900/10 pb-12 bg-black bg-opacity-50 backdrop-blur-lg px-10 py-10 my-10 rounded-lg" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                        {inputError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {inputError}</span>
                            </div>
                        )}
                        <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-6">
                            <div className="sm:col-span-12">
                                <label htmlFor="verification" className="block text-sm font-medium leading-6 text-white">
                                    Verification Code
                                </label>
                                <div className="mt-2 h-full">
                                    <VerificationInput value={verificationCode} onChange={setVerificationCode} />

                                    <div className='flex items-center justify-center'>

                                    <Link to="/register-presenter-resend-verify/">
                                        <div className="w-80 h-10 rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                                Resend Verification code
                                            </p>
                                        </div>
                                    </Link>
                                    </div>



                                </div>

                            </div>
                        </div>
                    </div>
            

                    
                    <button type="submit" className="block mx-auto">
                        {loading ? <div role="status">
                            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span class="sr-only text-white">Loading...</span>
                        </div> : <img className="h-20 cursor-pointer" src={button_g} alt="Button" />}
                    </button>

                </form>


                <div className="absolute top-10 right-10">
                    <FontAwesomeIcon icon={faBell} className="text-2xl text-white" />
                </div>
                <DateTimeDisplay />
            </div>
        </BackgroundImage>
    );
};

export default RegisterPresenterVerify;

const VerificationInput = ({ value, onChange }) => {
    const [digits, setDigits] = useState(Array(4).fill(''));

    useEffect(() => {
        if (value) {
            const newDigits = Array.from(String(value).padStart(4, '0'));
            setDigits(newDigits);
        }
    }, [value]);

    const handleChange = (index, digit) => {
        const newDigits = [...digits];
        newDigits[index] = digit;
        setDigits(newDigits);
        onChange(newDigits.join(''));
    };

    const handleKeyPress = (e, index) => {
        if (e.key === 'Backspace' && index > 0) {
            const newDigits = [...digits];
            newDigits[index - 1] = '';
            setDigits(newDigits);
            onChange(newDigits.join(''));
        } else if (e.key >= '0' && e.key <= '9') {
            handleChange(index, e.key);
            if (index < 3) {
                e.target.nextSibling.focus();
            }
        }
    };

    return (
        <div className="flex justify-center items-center space-x-2">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={() => { }}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    style={{ width: '6.5rem', height: '6.5rem' }} // Set custom width and height
                    className="border-2 border-gray-300 rounded-md text-center text-black font-xl text-3xl focus:outline-none"
                />
            ))}
        </div>
    );
};
