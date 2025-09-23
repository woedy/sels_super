import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../components/SideNavigator';
import { Link } from 'react-router-dom';

const Menu = () => {
    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />



                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">

                        <div className='grid gap-4 grid-cols-4 grid-rows-2'>
                            <Link to="/latest-results">
                                <div className="w-60 h-60 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>View Latest Results</p>
                                </div>
                            </Link>

                            <Link to="/map-view">
                                <div className="w-60 h-60 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>View Map</p>
                                </div>
                            </Link>



                            <Link to="/changes-region">
                                <div className="w-60 h-60 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Changes to Voters Registration</p>
                                </div>
                            </Link>

                            <Link to="/top-20-constituencies">
                                <div className="w-60 h-60 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Top 20 Constituencies</p>
                                </div>

                            </Link>





                            <div className="w-60 h-60 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Turnout Analysis</p>
                            </div>


                            <Link to="/election-summary">
                            <div className="w-60 h-60 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Election Summary</p>
                            </div>
                            </Link>

                            <Link to="/final-result">
                            <div className="w-60 h-60 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Final Result</p>
                            </div>
                            </Link>



                            <Link to="/settings">
                            <div className="w-60 h-60 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Settings</p>
                            </div>
                            </Link>


                        </div>



                    </div>

                </div>
            </div>
        </div>
    );
};

export default Menu;

