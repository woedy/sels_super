import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../components/SideNavigator';
import konedu from "../../assets/images/konedu.png";
import check from "../../assets/images/check.png";
import npp_logo from "../../assets/images/npp_logo.png";

const FinalResults = () => {
    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />

                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex flex-col items-center justify-center">
                        <div className='w-full'>
                            <p className='text-white text-center text-2xl font-bold mt-4 mb-[100px]' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>FINAL RESULTS</p>
                            <div className='col-span-1 flex items-center justify-center'>
                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg w-[750px] h-[450px] mb-5">
                                    <div className="h-full w-full  relative">
                                        <div className="h-[200px] w-[200px] bg-black bg-opacity-25 absolute top-4 left-3 transform -translate-y-1/4 rounded-lg">
                                            <div className=' '>
                                                <img src={konedu} alt="Image 1" className="rounded-mb h-full w-full" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-6 gap-1">
                                            <div className="col-span-5 ml-[230px] mt-5">
                                                <p className='text-white text-[80px] font-bold z-4' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>WINNER!</p>
                                                <div className="">
                                                    <p className='text-white text-3xl' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NANA ADDO DANKWA</p>

                                                    <p className='text-white text-5xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>AKUFO-ADDO</p>


                                                </div>

                                            </div>

                                        </div>

                                        <div className="col-span-6 mt-4 p-5 ">

                                            <div className="grid grid-cols-3 gap-1 w-full">

                                                <div className='col-span-1 justify-self-start'>
                                                    <p className='text-white text-xl' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>6,646,256 votes </p>
                                                    <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>51.3%</p>


                                                </div>


                                                <div className='col-span-1 justify-self-end text-right'>

                                                    <p className='text-white text-xl' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PARLIAMENTARY</p>
                                                    <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>154 Seats</p>



                                                </div>

                                                <div className="flex items-center justify-center flex-col">
                                                    <img src={npp_logo} alt="Image 1" className="rounded h-[70px] w-[70px] object-contain" />
                                                    <p className="text-white text-lg font-bold">NPP</p>
                                                </div>


                                            </div>

                                        </div>

                                        <p className='text-green-500 text-center text-3xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Defeats Mahama</p>



                                        <div className="h-[200px] w-[200px]  absolute top-4 right-[-40px] transform -translate-y-1/4 rounded-lg ">
                                            <div className=' '>
                                                <img src={check} alt="Image 1" className="rounded-mb h-full w-full " />
                                            </div>
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

export default FinalResults;

