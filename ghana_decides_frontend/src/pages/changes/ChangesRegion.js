import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../components/SideNavigator';
import { Link } from 'react-router-dom';

const ChangesRegion = () => {
    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />



                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">

                        <div>
                            <p className='text-white text-center text-2xl font-bold mb-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>CHANGES TO THE VOTERS REGISTER IN 2024</p>
                            <div>
                                <div className='grid gap-4 grid-cols-2 grid-rows-1 mr-5'>




                                </div>


                                <div className='grid gap-4 grid-cols-4 grid-rows-2'>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>AHAFO</p>
                                        </div>

                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>CENTRAL</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NORTHERN</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>UPPER WEST</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>ASHANTI</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>EASTERN</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>OTI</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>VOLTA</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>BONO</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>GREATER ACCRA</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>SAVANNAH</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>WESTERN</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>BONO EAST</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NORTH EAST</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>UPPER EAST</p>
                                        </div>
                                    </Link>

                                    <Link to='/changes-region-list'>
                                        <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>WESTERN NORTH</p>
                                        </div>
                                    </Link>


                                </div>


                            </div>


                        </div>




                    </div>

                </div>
            </div>
        </div>
    );
};

export default ChangesRegion;

