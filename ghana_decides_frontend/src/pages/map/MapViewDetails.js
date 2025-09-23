import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../components/SideNavigator';
import konedu from "../../assets/images/konedu.png";
import npp_logo from "../../assets/images/npp_logo.png";
import React, { useState } from 'react';
import { motion } from "framer-motion"


const MapViewDetails = () => {
    const [showHistory, setShowHistory] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />



                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">

                        <div className='w-full p-5 items-center justify-center'>

                            <div className='grid grid-cols-2 m-3'>

                                <div>
                                    <p className='text-white text-left text-2xl font-bold mb-3 mt-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>UPPER WEST</p>


                                    <p className='text-green-700 text-left text-xl font-bold ' >PRESIDENTIAL</p>



                                </div>

                                <div>



                                    <div className='grid grid-cols-2'>
                                        <div className='mr-2'>
                                            <div className="rounded-full bg-green-500 shadow-lg p-2 flex items-center justify-center">
                                                <p className="text-white text-center text-sm">Presidential</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="rounded-full bg-blue-500 shadow-lg p-2 flex items-center justify-center">
                                                <p className="text-white text-center text-sm">Parliamentary</p>
                                            </div>
                                        </div>

                                        <div></div> {/* Empty div as a placeholder */}



                                        <div className='flex justify-end '>
                                            <div className="w-40 rounded-full bg-red-500 shadow-lg p-2 flex items-center justify-center mt-2">
                                                <button className="text-white" onClick={toggleModal}>History</button>
                                            </div>

                                            {showModal && (
                                                <div className="fixed w-[120px] top-[120px] right-[50px] rounded  h-[450px] bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in animate-fade-out">

                                                    <div>
                                                        <p className="text-white text-center text-sm m-5">1992</p>
                                                        <p className="text-white text-center text-sm m-5">1996</p>
                                                        <p className="text-white text-center text-sm m-5">2000</p>
                                                        <p className="text-white text-center text-sm m-5">200R</p>
                                                        <p className="text-white text-center text-sm m-5">2004</p>
                                                        <p className="text-white text-center text-sm m-5">2008</p>
                                                        <p className="text-white text-center text-sm m-5">2008R</p>
                                                        <p className="text-white text-center text-sm m-5">2012</p>
                                                        <p className="text-white text-center text-sm m-5">2016</p>
                                                        <p className="text-white text-center text-sm m-5">2020</p>



                                                    </div>



                                                </div>
                                            )}

                                        </div>
                                    </div>




                                </div>




                            </div>



                            <div className='grid grid-cols-2 h-[550px]'>
                                <motion.div
                                    variants={
                                        {
                                            hidden: {
                                                opacity: 0,
                                            },
                                            show: {
                                                opacity: 1,
                                                transition: {
                                                    staggerChildren: 0.25
                                                }
                                            }

                                        }
                                    }
                                    initial='hidden'
                                    animate="show"

                                    className="mr-5 grid grid-cols-1 overflow-y-auto hide-scrollbar">
                                    {[...Array(10)].map((_, index) => (
                                        <motion.div

                                            variants={
                                                {
                                                    hidden: {
                                                        opacity: 0,
                                                    },
                                                    show: {
                                                        opacity: 1,

                                                    }

                                                }
                                            }

                                            key={index} className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 m-3 shadow-lg">
                                            <div className="grid grid-cols-5 gap-1 items-center justify-center">
                                                <motion.div

                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                                    className="col-span-1">
                                                    <img src={konedu} alt="Image 1" className="rounded" />
                                                </motion.div>
                                                <motion.div

                                                    initial={{ opacity: 0, y: -20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}

                                                    className="col-span-2 ml-3">
                                                    <div>
                                                        <p className='text-white' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>JOHN DRAMANI</p>
                                                        <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>RAWLINGS</p>
                                                    </div>
                                                    <div className="">
                                                        <div>
                                                            <img src={npp_logo} alt="Image 1" className="rounded h-10 w-10 object-contain" />
                                                            <p className='text-black text-lg font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NDP</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                                <div className='col-span-2 text-center items-center justify-center'>
                                                    <p className='text-white text-2xl text-right' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>6,345,454 votes</p>
                                                    <p className='text-white text-3xl font-bold text-right' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>51.3%</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                    ))}
                                </motion.div>

                                <iframe src="https://visitedplaces.com/embed/?map=ghana&projection=geoMercator&theme=light-green&water=0&graticule=0&names=1&duration=2000&placeduration=100&slider=0&autoplay=0&autozoom=none&autostep=0&home=GH" style={{ width: '100%', height: '550px' }}></iframe>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapViewDetails;

