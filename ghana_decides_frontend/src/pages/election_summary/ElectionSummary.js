import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../components/SideNavigator';
import konedu from "../../assets/images/konedu.png";
import npp_logo from "../../assets/images/npp_logo.png";
import { Link } from 'react-router-dom';

const ElectionSummary = () => {
    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />

                    <div className="h-full col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">

                        <div className='h-full w-full m-3  '>

                            <div className='grid grid-cols-2 mt-5 ml-5 mr-5'>

                                <p className='text-white text-left text-2xl font-bold mt-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>ELECTION SUMMARY</p>


                                <div className='mr-2 flex items-center justify-end'>
                                    <Link to='/election-summary-chart'>
                                        <div className=" w-40 rounded-full bg-green-500 shadow-lg p-2 flex items-center justify-center">
                                            <p className="text-white text-center text-sm">View Chart</p>
                                        </div>

                                    </Link>
                                </div>

                            </div>

                            <div className='grid grid-cols-3 gap-5 mt-[30px] p-4 overflow-y-auto w-full h-[570px] hide-scrollbar'>

                                {[...Array(10)].map((_, index) => (

                                    <div key={index} className='col-span-1'>
                                        <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center w-full h-50 mb-5">
                                            <div className="h-full w-full  relative">
                                                <div className="h-32 w-32 bg-black bg-opacity-25 absolute top-4 right-2/3 transform -translate-y-1/4 rounded-lg">
                                                    <div className=' '>
                                                        <img src={konedu} alt="Image 1" className="rounded-mb h-full w-full" />

                                                    </div>



                                                </div>
                                                <div className="grid grid-cols-6 gap-1">

                                                    <div className="col-span-5 ml-[140px] mt-5">
                                                        <p className='text-white' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NANA ADDO DANKWA</p>

                                                        <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>AKUFO-ADDO</p>


                                                    </div>

                                                    <div>
                                                        <img src={npp_logo} alt="Image 1" className="rounded p-2 h-[70px] w-[70px] object-contain" />
                                                    </div>



                                                    <div className="col-span-6 mt-4 p-5 ">

                                                        <div className="grid grid-cols-2 gap-1 w-full">

                                                            <div className='col-span-1 justify-self-start'>
                                                                <p className='text-white text-xl' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>6,646,256 votes </p>
                                                                <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>51.3%</p>


                                                            </div>


                                                            <div className='col-span-1 justify-self-end text-right'>

                                                                <p className='text-white text-xl' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PARLIAMENTARY</p>
                                                                <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>154 Seats</p>



                                                            </div>

                                                        </div>

                                                    </div>




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
    );
};

export default ElectionSummary;
