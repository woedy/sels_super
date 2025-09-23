import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../components/SideNavigator';
import konedu from "../../assets/images/konedu.png";
import npp_logo from "../../assets/images/npp_logo.png";

const Top20ConstituencyList = () => {
    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />

                    <div className="h-full col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">

                        <div className='h-full w-full m-3  '>

                            <div className='grid grid-cols-2 mt-5 ml-5 mr-5'>

                                <p className='text-white text-left text-2xl font-bold mt-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>TOP 20 VOTE GETTING CONSTITUENCIES - NPP</p>


                                <div className="flex flex-row items-center justify-end">
                                    <div className="flex flex-col items-center justify-center">
                                        <img src={npp_logo} alt="Image 1" className="rounded h-10 w-10 pb-1 object-contain" />
                                        <p className="text-white text-xl font-bold text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NPP</p>
                                    </div>
                                </div>


                            </div>

                            <div className='w-full flex items-center justify-center '>

                                <div className="w-full grid grid-cols-5 gap-3 items-center justify-center pb-5 pl-5 pr-5">
                                    <div className="col-span-1 items-center justify-center">
                                        <p className='text-white text-basic'>Constituencies</p>
                                    </div>

                                    <div className="col-span-1 items-center justify-center">
                                        <p className='text-white text-center text-basic'>2020<br />REGISTERED<br />VOTERS </p>
                                    </div>

                                    <div className="col-span-1 items-center justify-center">
                                        <p className='text-white text-center text-basic'>2016 %<br /> TURNOUT</p>
                                    </div>


                                    <div className="col-span-1 items-center justify-center">
                                        <p className='text-white text-center text-basic'>2016 NPP<br />VOTES</p>
                                    </div>

                                    <div className="col-span-1 items-center justify-center">
                                        <p className='text-white text-center text-basic'>2016 NDC<br />VOTES</p>
                                    </div>

                                </div>

                            </div>


                            <div className="overflow-y-auto h-[430px] hide-scrollbar">
                                <div className="h-auto grid grid-cols-1 gap-5">
                                    {[...Array(10)].map((_, index) => (
                                        <div key={index} className="w-full bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center shadow-lg ">
                                            <div className="w-full grid grid-cols-5 gap-3 items-center justify-center p-5">

                                                <div className="col-span-1 items-center justify-center">
                                                    <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>ATWIMA KWANWOMA</p>
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

export default Top20ConstituencyList;
