import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../components/SideNavigator';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { baseUrl, userToken } from '../../Constants';

const RegionDetails = () => {
    const { region_id } = useParams();
    const [region, setRegion] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("UserEffecttt");
        const url = baseUrl + 'api/regions/region-details/?region_id=' + region_id;
        fetch(url, {
            headers: {
                Authorization: `Token ${userToken}`
            }
        })
        .then((response) => {
            if(response.status == 400) {
                navigate('/400');

            }
            return response.json();
        })
        .then((data) => {
            setRegion(data.data);
        });
    }, []);


    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />



                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">

                        <div>
                            <p className='text-white text-center text-2xl font-bold mb-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>VIEW LATEST RESULTS</p>
                            <div>
                                <div className='grid gap-4 grid-cols-2 grid-rows-1 mr-5'>

                                    <Link to="/latest-results-list">

                                        <div className="w-full h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <div>
                                                <p className="text-white text-xl font-bold p-1 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PRESIDENTIAL</p>
                                                <p className="text-green-700 text-basic font-bold text-center" >ALL REGIONS</p>
                                            </div>
                                        </div>

                                    </Link>


                                    <Link to="/latest-results-list">
                                        <div className="w-full h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <div>
                                                <p className="text-white text-xl font-bold p-1 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PRESIDENTIAL</p>
                                                <p className="text-green-700 text-basic font-bold text-center">GENERAL</p>
                                            </div>


                                        </div>
                                    </Link>


                                </div>


                                <div className='grid gap-4 grid-cols-4 grid-rows-2'>

                                    {region ?   <Link to="/latest-results-list">
                                        <div className="w-full h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                            <div>
                                                <p className="text-white text-xl font-bold p-1 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{region.region_name}</p>
                                                <p className="text-green-700 text-basic font-bold text-center">Detail Page</p>
                                            </div>


                                        </div>
                                    </Link> : null}

             

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default RegionDetails;

