import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../components/SideNavigator';
import { Link } from 'react-router-dom';
import npp_logo from "../../assets/images/npp_logo.png";
import ndc_logo from "../../assets/images/ndc_logo.png";
import gum_logo from "../../assets/images/gum_logo.png";
import cpp_logo from "../../assets/images/cpp_logo.png";

import gfp_logo from "../../assets/images/gfp_logo.png";
import gcpp_logo from "../../assets/images/gcpp_logo.png";
import apc_logo from "../../assets/images/apc_logo.png";
import lpg_logo from "../../assets/images/lpg_logo.png";


import pnc_logo from "../../assets/images/pnc_logo.png";
import ppp_logo from "../../assets/images/ppp_logo.png";
import ndp_logo from "../../assets/images/ndp_logo.png";
import llp_logo from "../../assets/images/llp_logo.png";

const Top20Constituency = () => {
    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />



                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">

                        <div>
                            <p className='text-white text-center text-2xl font-bold mb-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>TOP 20 VOTE GETTING CONSTITUENCIES</p>
                            <div>
                                <div className='grid gap-4 grid-cols-2 grid-rows-1 mr-5'>




                                </div>


                                <div className='grid gap-4 grid-cols-4 grid-rows-2'>

                                    <Link to='/top-20-constituencies-list'>
                                        <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <div className="flex flex-col items-center justify-center">
                                                <img src={npp_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                                <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NPP</p>
                                            </div>
                                        </div>

                                    </Link>




                                    <Link to='/top-20-constituencies-list'>
                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={ndc_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NDC</p>
                                        </div>
                                    </div>
                                    </Link>


                                    
                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={gum_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>GUM</p>
                                        </div>
                                    </div>

                                    
                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={cpp_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>CPP</p>
                                        </div>
                                    </div>


                                               
                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={gfp_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>GFP</p>
                                        </div>
                                    </div>

                                               
                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={gcpp_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>GCPP</p>
                                        </div>
                                    </div>

                                               
                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={apc_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>APC</p>
                                        </div>
                                    </div>


                                               
                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={lpg_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>LPG</p>
                                        </div>
                                    </div>


                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={pnc_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PNC</p>
                                        </div>
                                    </div>

                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={ppp_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PPP</p>
                                        </div>
                                    </div>


                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={ndp_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NDP</p>
                                        </div>
                                    </div>

                                    <div className="w-40 h-40 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={llp_logo} alt="Image 1" className="rounded h-20 w-20 pb-2 object-contain" />
                                            <p className="text-white text-xl font-bold  text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>LLP</p>
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

export default Top20Constituency;

