import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../components/SideNavigator';
import konedu from "../../assets/images/konedu.png";
import npp_logo from "../../assets/images/npp_logo.png";
import ChartSummaryComponent from '../../components/CharSummaryComponent';

const ElectionSummaryChart = () => {
    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />

                    <div className="h-full col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">

                        <div className='h-full w-full m-3  '>

                            <div className='grid grid-cols-2 mt-5 ml-5 mr-5'>

                                <p className='text-white text-left text-2xl font-bold mt-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>2024 PRESIDENTIAL RESULTS</p>




                            </div>
                            <div className='ml-5 mr-5 p-5'>
                                <div className='m-6 p-5'>
                                    <ChartSummaryComponent />
                                </div>
                            </div>







                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElectionSummaryChart;
