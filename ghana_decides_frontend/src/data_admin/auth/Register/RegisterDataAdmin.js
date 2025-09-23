import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import button_g from "../../../assets/images/button_g.svg";
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../Constants';
import BackgroundImage from '../../../components/BackgroundImage';
import DateTimeDisplay from '../../../components/DateTimeDisplay';

const RegisterDataAdmin = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [image, setImage] = useState(null);


    const navigate = useNavigate();


    const [inputError, setInputError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate email
        if (!validateEmail(email)) {
            setInputError('Invalid email address');
            return;
        }
    
        // Clear any previous error
        setInputError('');
    
        if (firstName === "") {
            setInputError('First name required.');
            return;
        }
    
        if (lastName === "") {
            setInputError('Last name required.');
            return;
        }
    
        if (contactNumber === "") {
            setInputError('Contact number required.');
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await fetch(`${baseUrl}api/accounts/check-email-exists/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
    
            const data = await response.json();
    
            if (response.ok && data.message === 'Successful') {
                // Construct the payload
                const payload = {
                    firstName,
                    lastName,
                    email,
                    contactNumber,
                    image,
                };
                //console.log("#############################3");
                //console.log(payload);
    
                // Navigate to another page with the payload
                navigate('/register-data-admin-idcard', { state: { payload } });
            } else if (data.message === 'Errors' && data.errors.email[0] === 'Email already exists in our database.') {
                setInputError('Email already exists');
            } else {
                setInputError('Error checking email');
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setInputError('Error checking email');
        } finally {
            setLoading(false);
        }
    };
    

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };


    return (
        <BackgroundImage imageUrl={`${process.env.PUBLIC_URL}/ghana_decides_back.png`}>
            <div className="relative flex flex-col items-center justify-center h-full">
                <div className="text-black text-5xl font-black mb-1">
                    Register - Data Admin
                </div>

                <form onSubmit={handleSubmit} >

                    <div className="border-b border-gray-900/10 pb-12 bg-black bg-opacity-50 backdrop-blur-lg px-10 py-10 my-10 rounded-lg" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                        {inputError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {inputError}</span>
                            </div>
                        )}
                        <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-6">

                            <div className="sm:col-span-12">
                                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-white">
                                    First Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-black-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black bg-opacity-25 text-white border-blue-400 border-opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-12">
                                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-white">
                                    Last Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-black-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black bg-opacity-25 text-white border-blue-400 border-opacity-50"
                                    />
                                </div>
                            </div>

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
                                <label htmlFor="contactNumber" className="block text-sm font-medium leading-6 text-white">
                                    Contact Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="contactNumber"
                                        name="contactNumber"
                                        type="text"
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-black-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black bg-opacity-25 text-white border-blue-400 border-opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-12 flex flex-col items-center">
                                <label htmlFor="image" className="block text-sm font-medium leading-6 text-white cursor-pointer">
                                    Upload Picture
                                </label>
                                <label htmlFor="image" className="rounded-full border-2 border-white w-10 h-10 flex justify-center items-center cursor-pointer mt-2">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        ></path>
                                    </svg>
                                    <input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                {image && (
                                    <div className="relative mt-2">
                                        <img src={image} alt="Uploaded" className="w-20 h-20 object-cover rounded-full border-2 border-white" />
                                        <button
                                            onClick={() => setImage(null)}
                                            className="absolute top-0 right-0 bg-gray-800 rounded-full p-1 hover:bg-gray-600 focus:outline-none"
                                        >
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                )}
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

export default RegisterDataAdmin;
