import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../components/SideNavigator';
import konedu from "../../assets/images/konedu.png";
import npp_logo from "../../assets/images/npp_logo.png";

const ChangesRegionList = () => {
    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />

                    <div className="h-full col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">

                        <div className='h-full w-full m-3  '>

                            <div className='grid grid-cols-2 mt-5 ml-5 mr-5'>

                                <p className='text-white text-left text-2xl font-bold mt-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>CHANGES TO THE VOTERS REGISTER IN 2024</p>


                                <p className='text-green-700 text-right text-2xl font-bold mb-3 mt-3'  >AHAFO</p>


                            </div>

                            <div className='w-full flex items-center justify-center '>

                            <div className="w-full grid grid-cols-5 gap-3 items-center justify-center pb-5 pl-5 pr-5">
                                <div className="col-span-1 items-center justify-center">
                                    <p className='text-white text-basic'>Constituencies</p>
                                </div>

                                <div className="col-span-1 items-center justify-center">
                                    <p className='text-white text-center text-basic'>2020<br/>REGISTERED<br/>VOTERS </p>
                                </div>

                                <div className="col-span-1 items-center justify-center">
                                    <p className='text-white text-center text-basic'>2024<br/>REGISTERED<br/>VOTERS </p>
                                </div>


                                <div className="col-span-1 items-center justify-center">
                                    <p className='text-white text-center text-basic'>2020 - 2016<br/>DIFFERENCE</p>
                                </div>

                                <div className="col-span-1 items-center justify-center">
                                    <p className='text-white text-center text-basic'>PERCENT<br/>CHANGE</p>
                                </div>

                                </div>

                            </div>


                            <div className="overflow-y-auto h-[430px] hide-scrollbar">
                                <div className="h-auto grid grid-cols-1 gap-5">
                                    {[...Array(10)].map((_, index) => (
                                        <div key={index} className="w-full bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center shadow-lg ">
                                            <div className="w-full grid grid-cols-5 gap-3 items-center justify-center p-5">

                                                <div className="col-span-1 items-center justify-center">
                                                    <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>GREATER ACCRA</p>
                                                </div>
                          
                                         

                                                <div className='col-span-1'>
                                                    <div className=''>
                                                        <p className='text-white text-2xl text-center'>113,468</p>
                                                    </div>
                                                </div>

                                                <div className='col-span-1'>
                                                    <div className=''>
                                                        <p className='text-white text-2xl text-center'>11,343</p>
                                                    </div>
                                                </div>

                                                <div className='col-span-1'>
                                                    <div className=''>
                                                        <p className='text-white text-2xl text-center'>145</p>
                                                    </div>
                                                </div>

                                                <div className='col-span-1'>
                                                    <div className=''>
                                                        <p className='text-white text-2xl text-center'>13%</p>
                                                    </div>
                                                </div>
                                         
                                            </div>
                                        </div>

                                    ))}

                                </div>
                            </div>


                            <div className="w-full bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center shadow-lg ">
                                            <div className="w-full grid grid-cols-5 gap-3 items-center justify-center p-5">

                                                <div className="col-span-1 items-center justify-center">
                                                    <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Total</p>
                                                </div>
                          
                                         

                                                <div className='col-span-1'>
                                                    <div className=''>
                                                        <p className='text-white text-2xl text-center'>113,468</p>
                                                    </div>
                                                </div>

                                                <div className='col-span-1'>
                                                    <div className=''>
                                                        <p className='text-white text-2xl text-center'>11,343</p>
                                                    </div>
                                                </div>

                                                <div className='col-span-1'>
                                                    <div className=''>
                                                        <p className='text-white text-2xl text-center'>145</p>
                                                    </div>
                                                </div>

                                                <div className='col-span-1'>
                                                    <div className=''>
                                                        <p className='text-white text-2xl text-center'>13%</p>
                                                    </div>
                                                </div>
                                         
                                            </div>
                                        </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangesRegionList;
