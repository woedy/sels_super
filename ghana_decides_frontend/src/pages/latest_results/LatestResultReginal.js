import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../components/SideNavigator';
import konedu from "../../assets/images/konedu.png";
import npp_logo from "../../assets/images/npp_logo.png";

const LatestResultRegional = () => {
    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />

                    <div className="h-full col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">

                        <div className='h-full w-full m-3  '>
                            <div className='grid grid-cols-3 m-5'>

                                <div>
                                <p className='text-white text-left text-2xl font-bold mb-1mt-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>LATEST PRESIDENTIAL RESULTS</p>
                                <p className='text-green-700 text-left text-2xl font-bold  ' >AHAFO REGION</p>

                                </div>

                          
                                <div className='grid grid-cols-2 flex items-center justify-center'>
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
                                </div>

                                <div className='flex items-center justify-center'>
                                        <div className="w-[150px] rounded-full bg-gray-400 shadow-lg p-2 flex items-center justify-center">
                                            <p className="text-black text-center text-sm">Constituencies</p>
                                        </div>
                                    </div>
                            </div>



                            <div className="overflow-y-auto h-[580px] hide-scrollbar">
                                <div className="h-auto grid grid-cols-1 gap-5">
                                    {[...Array(10)].map((_, index) => (
                                        <div key={index} className="w-full bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center ">
                                            <div className="w-full grid grid-cols-6 gap-3 items-center justify-center p-5">
                                                <div className="col-span-2 items-center justify-center">
                                                    <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>GREATER ACCRA</p>
                                                </div>
                                                <div className="col-span-2 items-center justify-center">
                                                    <div className='grid grid-cols-3 gap-5 items-center justify-center'>
                                                        <div className='col-span-1'>
                                                            <img src={konedu} alt="Image 1" className="rounded" />
                                                        </div>

                                                        <div className='col-span-2 items-center justify-center'>
                                                            <p className='text-white' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>JOHN DRAMANI</p>
                                                            <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>RAWLINGS</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-1 flex items-center justify-center">
                                                    <div className='text-center'>
                                                        <img src={npp_logo} alt="Image 1" className="rounded h-[70px] w-[70px] object-contain" />
                                                        <p className='text-white text-lg font-bold'>NDP</p>
                                                    </div>
                                                </div>

                                                <div className='col-span-1'>
                                                    <div className=''>
                                                        <p className='text-white text-2xl'>6,345,454 votes</p>
                                                        <p className='text-white text-3xl font-bold'>51.3%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    ))}

                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestResultRegional;
