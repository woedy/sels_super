import { Link } from "react-router-dom";
import konedu from "../../assets/images/konedu.png";
import npp_logo from "../../assets/images/npp_logo.png";
import ChartComponent from '../../components/ChartComponent';
import { userToken } from "../../Constants";
import DataAdminSideNav from "../components/DataAdminSideNavigator";

const ElectionDetails = () => {
    console.log(userToken);

    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen p-5 overflow-hidden">

                    <DataAdminSideNav />
    
                    <div className="col-span-8 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center h-full" >
                        <div className='w-full'>
                            <div className=' text-center items-center justify-center'>
                                <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PRESIDENTIAL RESULTS 1992</p>

                                <p className='text-white text-lg' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Results based on 273 of 275 Constituencies</p>


                            </div>

                            <div class="grid gap-2 grid-cols-1 grid-rows-1 mr-6 h-full">




                            <Link to='/election-summary'>
                                <div class="grid gap-4 grid-cols-2 grid-rows-1">
                                    <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center w-full h-60 m-3" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                        <div className="h-full w-full  relative">
                                            <div className="h-32 w-32 bg-black bg-opacity-25 absolute top-2 right-2/3 transform -translate-y-1/4 rounded">
                                                <div className=' '>
                                                    <img src={konedu} alt="Image 1" className="rounded h-full w-full" />

                                                </div>



                                            </div>
                                            <div className="grid grid-cols-4 gap-1">

                                                <div className="col-span-3 ml-40 mt-5">
                                                    <p className='text-white' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NANA ADDO DANKWA</p>

                                                    <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>AKUFO-ADDO</p>


                                                </div>

                                                <img src={npp_logo} alt="Image 1" className="rounded p-3" />

                                                <div className="col-span-4 mt-4 p-5 ">

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


                                    <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center w-full h-60 m-3" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                        <div className="h-full w-full  relative">
                                            <div className="h-32 w-32 bg-black bg-opacity-25 absolute top-2 left-2/3 transform -translate-y-1/4 rounded">
                                                <div className=' '>
                                                    <img src={konedu} alt="Image 1" className="rounded h-full w-full" />

                                                </div>



                                            </div>
                                            <div className="grid grid-cols-4 gap-1 border border-green-500 border-8 rounded h-full">

                                                <img src={npp_logo} alt="Image 1" className="rounded p-3" />

                                                <div className="col-span-3 ml- mt-5">
                                                    <p className='text-white' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>NANA ADDO DANKWA</p>

                                                    <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>AKUFO-ADDO</p>


                                                </div>



                                                <div className="col-span-4 mt-4 p-5 ">

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
                                </Link>


                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex text-center items-center justify-center p-3 w-full h m-3" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                    <div className=''>
                                        <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>2024 PRESIDENTIAL RESULTS</p>

                                        <Link to='/election-summary-chart'>
                                        <ChartComponent />  
                                        </Link>
    


                                    </div>

                                </div>



                            </div>



                        </div>




                    </div>

                    <div className="col-span-3 p-4  bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center overflow-y-auto hide-scrollbar">
                        <div className="mr-5  min-w-full grid grid-cols-1 mt-[140px]">
                        

                        
                        <Link to="/election-2024">
                                <div className="h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                    Battleground Regions
                                    </p>
                                </div>
                            </Link>



       
                            <Link to="/election-2024">
                                <div className="h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                    Balance of Power in Parliament
                                    </p>
                                </div>
                            </Link>



                            <Link to="/election-2024">
                                <div className="h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                    Presidential - Regional Outlook
                                    </p>
                                </div>
                            </Link>


                            
                            <Link to="/election-2024">
                                <div className="h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                    Parliamentary Swing Seats
                                    </p>
                                </div>
                            </Link>


                            <Link to="/election-2024">
                                <div className="h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                    Marginal Seats
                                    </p>
                                </div>
                            </Link>


                            <Link to="/election-2024">
                                <div className="h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                    Skirt & Blouse
                                    </p>
                                </div>
                            </Link>



                            <Link to="/election-2024">
                                <div className="h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                    Presidential Wins
                                    </p>
                                </div>
                            </Link>


                            
                            <Link to="/election-2024">
                                <div className="h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                    Parliamentary Wins
                                    </p>
                                </div>
                            </Link>


                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ElectionDetails;
