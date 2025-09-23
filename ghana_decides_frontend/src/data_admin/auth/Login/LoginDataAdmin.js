import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import button_g from "../../../assets/images/button_g.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { baseUrl } from '../../../Constants';
import DateTimeDisplay from '../../../components/DateTimeDisplay';




const LoginDataAdmin = () => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fcm_token, setFcmtoken] = useState('sddfdsfdsfsdf');
    const navigate = useNavigate();

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation
        let isValid = true;
    
        if (!email.trim()) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid');
            isValid = false;
        } else {
            setEmailError('');
        }
    
        if (!password.trim()) {
            setPasswordError('Password is required');
            isValid = false;
        } else {
            setPasswordError('');
        }
    
        if (!isValid) {
            return;
        }
    
        const url = baseUrl + "api/accounts/login-data-admin/";
        const data = {
            email,
            password,
            fcm_token
        };
    
        setLoading(true);
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            const responseData = await response.json(); // Parse response body as JSON
    
            if (response.status === 200) {
                // Login successful, store user data and token in local storage
                localStorage.setItem('userData', JSON.stringify(responseData.data));
                localStorage.setItem('token', responseData.data.token);
    
                // Redirect to dashboard or perform other actions
                console.log('Login successful');
                console.log(responseData.data.token);
                navigate("/data-admin-dashboard");
            } else if (response.status === 400) {
                setEmailError(responseData.errors.email ? responseData.errors.email[0] : '');
                setPasswordError(responseData.errors.password ? responseData.errors.password[0] : '');
            } else {
                // Login failed, display error message
                console.error('Login failed:', responseData.message);
            }
        } catch (error) {
            // Network or other errors
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };
    


    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="text-black text-5xl font-black mb-1">
                Login - Data Admin
            </div>



            <form onSubmit={handleSubmit}>

                <div className="space-y-12">


                    <div className="border-b border-gray-900/10 pb-12 bg-black bg-opacity-50 backdrop-blur-lg px-10 py-10 my-10 rounded-lg" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>

                        {emailError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {emailError}</span>
                            </div>
                        )}
                        <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-6">




                            <div className="sm:col-span-12">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-black-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black bg-opacity-25 text-white border-blue-400 border-opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-12">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-black-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black bg-opacity-25 text-white border-blue-400 border-opacity-50"
                                    />
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
    );
};

export default LoginDataAdmin;
