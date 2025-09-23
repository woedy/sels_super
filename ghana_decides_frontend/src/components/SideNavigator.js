import React from 'react';
import { FaHome, FaSearch, FaBell, FaTh, FaMap, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const navigation = [
    { name: "Dashboard", href: '/presenter-dashboard' },
    { name: "Map", href: '/map-view' },
    { name: "Notification", href: '/notification' },
    { name: "Menu", href: '/menu' },
    { name: "Search", href: '/search' },
    { name: "Logout", href: '/' },
];

export default function SideNav(props) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout actions, e.g., clear user token
        localStorage.setItem('token', "");
        console.log('Logout clicked');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <div className="col-span-1 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex flex-col items-center justify-center w-full " style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                <div className="grid grid-rows-8 h-full w-full">
                    <div className="row-span-1 flex items-center justify-center" onClick={handleBack}>
                        <div className="cursor-pointer" >
                            <FaArrowLeft className="text-white text-3xl" />
                            <p className='text-sm text-white' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>BACK</p>
                        </div>
                    </div>


                    <div className="row-span-1 flex items-center justify-center"></div>


                    {navigation.map((item) => (
                        <NavLink
                            to={item.href}
                            key={item.name}
                            className="row-span-1 flex flex-col items-center justify-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                            <div className={`rounded-full p-2 ${location.pathname === item.href ? 'bg-white bg-opacity-50' : ''}`} style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }}>
                                {item.name === "Dashboard" && <FaHome className="text-white text-3xl" />}
                                {item.name === "Map" && <FaMap className="text-white text-3xl" />}
                                {item.name === "Notification" && <FaBell className="text-white text-3xl" />}
                                {item.name === "Menu" && <FaTh className="text-white text-3xl" />}
                                {item.name === "Search" && <FaSearch className="text-white text-3xl" />}
                                {item.name === "Logout" && <FaSignOutAlt className="text-white text-3xl" onClick={handleLogout} />}
                            </div>
                            <p className='text-sm text-white mt-1 text-center'>{item.name}</p>
                        </NavLink>
                    ))}

                    <div className="row-span-1 flex items-center justify-center"></div>
                </div>
            </div>
        </>
    );
}
