import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import MapGL, { FullscreenControl, GeolocateControl, Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl';
import { useEffect, useState, useRef } from 'react';
import data from '../../data/skateboard-parks.json'; // Import the JSON data
import data2 from '../../data/ghana-locations.json';
import npp_logo from "../../assets/images/npp_logo.png";
import ndc_logo from "../../assets/images/ndc_logo.png";
import konedu from "../../assets/images/konedu.png";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"
import MapSideNav from './MapSideNavigator';
import { baseUrlMedia, baseWsUrl } from '../../Constants';


const MapView = () => {
    const [parkData, setParkData] = useState(null);
    const [selectedPark, setSelectedPark] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [showDisplayNameModal, setShowDisplayNameModal] = useState(false); // State to manage modal visibility
    const mapRef = useRef(null); // Reference to the MapGL component
    const navigate = useNavigate();

    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const [resultState, setResultState] = useState("General");
    const [regionName, setRegionName] = useState("All Regions");
    const [electionLevel, setElectionLevel] = useState("Presidential");
    const [electionYear, setElectionYear] = useState("2024");
    const [candidates, setCandidates] = useState([]);
    const [displayNameList, setDisplayNameList] = useState([]);
    const [parlParties, setParlParties] = useState({});


    const toggleModal = () => {
        setShowHistoryModal(!showHistoryModal);
    };

    useEffect(() => {
        setParkData(data); // Set the data from the import to the state

        // Add event listener to detect clicks outside of the modal
        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);


    useEffect(() => {
        const socket = new WebSocket(baseWsUrl + 'ws/live-map-consumer/');

        socket.onopen = () => {
            console.log('WebSocket connected');

            const payload = {
                command: 'get_live_map_data',
            };

            socket.send(JSON.stringify(payload));
        };


        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.payload && data.payload.message === 'Successful') {
                setResultState(data.payload.data.result_state);
                setRegionName(data.payload.data.region_name);
                setElectionLevel(data.payload.data.election_level);
                setElectionYear(data.payload.data.election_year);
                setCandidates(data.payload.data.candidates);
                setDisplayNameList(data.payload.data.display_names_list);
                setParlParties(data.payload.data.parl_parties);
                console.log(data.payload)

            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            socket.close();
        };
    }, []);



    const handleOutsideClick = (e) => {
        // Close the modal if the click is outside of the modal content
        if (e.target.closest(".bg-white") === null) {
            setShowModal(false);
            setShowDisplayNameModal(false);
        }
    };



    useEffect(() => {
        const socket = new WebSocket(baseWsUrl + 'ws/live-map-consumer/');
    
        socket.onopen = () => {
            console.log('WebSocket connected');
    
            const data = {
                election_year: electionYear,
                election_level: electionLevel,
                region_name: regionName,
                result_state: resultState,
            };

            console.log('DATAAAAAA connected');
            console.log(data);


    
            const payload = {
                command: 'get_map_filter_data',
                data: data
            };
    
            socket.send(JSON.stringify(payload));
        };
    
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.payload && data.payload.message === 'Successful') {
                setResultState(data.payload.data.result_state);
                setRegionName(data.payload.data.region_name);
                setElectionLevel(data.payload.data.election_level);
                setElectionYear(data.payload.data.election_year);
                setCandidates(data.payload.data.candidates);
                setDisplayNameList(data.payload.data.display_names_list);
                setParlParties(data.payload.data.parl_parties);
                console.log(data.payload);
            }
        };
    
        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };
    
        return () => {
            socket.close();
        };
    }, [electionYear, electionLevel, regionName, resultState]);
    


    const handleRegionNameClick = (option, e) => {
        //e.preventDefault(); // Prevent default form submission
        if (regionName !== option) {
            setRegionName(option); // Update the regionName state
            setResultState("Region");
    
            // WebSocket connection will be triggered by the useEffect hook
        }
    };
    

    
    //const handleRegionNameClick = (option, e) => {
//
    //    setRegionName((regionName) => option)
    //};
    


        const handleElectionLevelClick = (option) => {
        if (electionLevel !== option) {
            setElectionLevel(option); 
    
        }
    };
    




    const handleResultStateClick = (option) => {
        setResultState(option);

    };


    const handleElectionYearClick = (year) => {
        setElectionYear(year);
        setShowHistoryModal(false); // Close the modal after selecting a year
    };

    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-15 gap-5 h-screen w-screen ">



                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">
                        {parkData && (
                            <MapGL
                                ref={mapRef} // Assign the mapRef to the MapGL component
                                mapboxAccessToken="pk.eyJ1IjoiZGVsYWRlbS1waW5nc2hpcCIsImEiOiJjbHRubWF2eTUwOXBiMm1vNnI0MTNjZmNyIn0.c_hBpKu5mroAjOtRHuKb6Q"
                                initialViewState={{
                                    width: '100%',
                                    height: '100%',
                                    longitude: -3.9,
                                    latitude: 8.6,
                                    zoom: 6,


                                }}
                                style={{ width: " 100%", height: "100%" }}
                                mapStyle="mapbox://styles/deladem-pingship/cluv4uiay004y01p5b7es8xp0"
                            >

                                <Source type="geojson" data={data2}>
                                    <Layer
                                        id="polygon-fill"
                                        type="fill"
                                        paint={{
                                            'fill-color': '#29465B',
                                            //'fill-color':"#1F45FC"
                                            //'fill-opacity': 0.8,
                                        }}

                                    />


                                </Source>

                                <NavigationControl position='bottom-right' />
                                <GeolocateControl position='bottom-right' />
                                <FullscreenControl position='bottom-right' />
                                <div className="grid grid-cols-12 gap-5 h-screen w-screen p-5">
                                    <MapSideNav />

                                    <div className="col-span-9 rounded-lg flex items-start justify-center">
                                        <div className='grid grid-cols-2 h-[700px]'>

                                            <div className="col-span-2 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg rounded-lg flex items-start justify-left z-10 p-4 mb-3 h-[150px]">
                                                <div className='grid grid-cols-2 gap-5 w-full '>
                                                    <div>
                                                        <p className='text-black text-left text-[15px] font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{resultState}</p>
                                                        <div className='flex flex-row '>
                                                            <p className='text-white text-left text-2xl font-bold uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{regionName}</p>

                                                            <div className='rounded-full p-2 items-center text-sm justify-center ml-2 bg-white bg-opacity-20' style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }} onClick={() => setShowDisplayNameModal(true)} >
                                                                <FaChevronDown className='text-white items-center text-sm justify-center mt-1' />

                                                            </div>
                                                        </div>

                                                        {regionName !== "All Regions" && (
                                                            <>
                                                                <div className='flex mt-1'>

                                                                    <div className='flex flex-row mr-3'>
                                                                        <p className='text-white text-left font-bold uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Constituency</p>

                                                                        <div className='p-1 items-center text-sm justify-center ml-2 bg-white bg-opacity-20' style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }} onClick={() => setShowDisplayNameModal(true)} >
                                                                            <FaChevronDown className='text-white items-center text-sm justify-center' />

                                                                        </div>
                                                                    </div>

                                                                    <div className='flex flex-row mr-3'>
                                                                        <p className='text-white text-left font-bold uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Electoral Area</p>

                                                                        <div className='p-1 items-center text-sm justify-center ml-2 bg-white bg-opacity-20' style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }} onClick={() => setShowDisplayNameModal(true)} >
                                                                            <FaChevronDown className='text-white items-center text-sm justify-center' />

                                                                        </div>
                                                                    </div>


                                                                    <div className='flex flex-row mr-3'>
                                                                        <p className='text-white text-left font-bold uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Polling Station</p>

                                                                        <div className='p-1 items-center text-sm justify-center ml-2 bg-white bg-opacity-20' style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }} onClick={() => setShowDisplayNameModal(true)} >
                                                                            <FaChevronDown className='text-white items-center text-sm justify-center' />

                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            </>

                                                        )}





                                                        <p className='text-green-700 text-left text-sm font-bold uppercase' >{electionLevel}</p>
                                                    </div>

                                                    <div className='flex items-center justify-center'>
                                                        <p className='text-black text-left text-[40px] font-black' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>ELECTION {electionYear}</p>
                                                    </div>

                                                </div>


                                            </div>
                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0 },
                                                    show: {
                                                        opacity: 1,
                                                        transition: {
                                                            staggerChildren: 0.25
                                                        }
                                                    }
                                                }}
                                                initial='hidden'
                                                animate="show"
                                                className="mr-5 grid grid-cols-1 overflow-y-auto hide-scrollbar ">

                                                {electionLevel === 'Presidential' ? (
                                                    <>
                                                        {candidates && candidates.map((candidate) => (
                                                            <motion.div
                                                                variants={{
                                                                    hidden: { opacity: 0 },
                                                                    show: { opacity: 1 }
                                                                }}
                                                                key={candidate.election_prez_id}
                                                                className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 m-3 shadow-lg h-[150px] ">
                                                                <div className="grid grid-cols-5 gap-1 items-center justify-center">
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                                                        className="col-span-1">
                                                                        <img src={`${baseUrlMedia}${candidate.candidate?.photo}`} alt="Image 1" className="rounded" />
                                                                    </motion.div>
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: -20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                                                        className="col-span-2 ml-3">
                                                                        <div>
                                                                            <p className='text-white uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{candidate.candidate?.first_name} {candidate.candidate?.middle_name}</p>
                                                                            <p className='text-white text-2xl font-bold uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{candidate.candidate?.last_name}</p>
                                                                        </div>
                                                                        <div className="">
                                                                            <div>
                                                                                <img src={`${baseUrlMedia}${candidate.candidate?.party?.party_logo}`} alt="Image 1" className="rounded h-10 w-10 object-contain" />
                                                                                <p className='text-black text-lg font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{candidate.candidate?.party?.party_initial}</p>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                    <div className='col-span-2 text-center items-center justify-center'>
                                                                        <p className='text-white text-2xl text-right' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{candidate?.total_votes} votes</p>
                                                                        <p className='text-black text-3xl font-bold text-right' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{candidate?.total_votes_percent}%</p>
                                                                        <p className='text-white text-xl text-right' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{candidate?.parliamentary_seat} seats</p>

                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </>
                                                ) : (
                                                    (
                                                        <>
                                                            {parlParties && (
                                                                <motion.div
                                                                    variants={{
                                                                        hidden: { opacity: 0 },
                                                                        show: { opacity: 1 }
                                                                    }}

                                                                    className='flex grid grid-cols-2 gap-2 h-[200px] '>

                                                                    <div className="w-full bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center w-[250px] p-5">
                                                                        {parlParties.first_parl_party && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}>
                                                                                <div className="w-full grid grid-cols-6 gap-5 items-center justify-center">



                                                                                    <div

                                                                                        className="col-span-3 flex items-center justify-center">
                                                                                        <div className='text-center'>
                                                                                            <img src={`${baseUrlMedia}${parlParties.first_parl_party.party_logo}`} alt="Image 1" className="rounded h-[70px] w-[70px] object-contain" />
                                                                                            <p className='text-white text-lg font-bold'>{parlParties.first_parl_party.party_initial}</p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div

                                                                                        className='col-span-3'>
                                                                                        <div className=''>
                                                                                            <p className='text-white text-3xl font-bold items-center justify-center text-center'>{parlParties.first_parl_party.seats}</p>
                                                                                            <p className='text-white text-2xl items-center justify-center text-center'>seats</p>

                                                                                        </div>
                                                                                    </div>


                                                                                </div>

                                                                                <div className='flex '>
                                                                                    <p className='text-black text-xl font-bold'>2020: </p>
                                                                                    <p className='text-black text-xl'>145 seats - 47%</p>


                                                                                </div>

                                                                                <div className='flex '>
                                                                                    <p className='text-black text-xl font-bold'>2016: </p>
                                                                                    <p className='text-black text-xl'>145 seats - 47%</p>


                                                                                </div>

                                                                                <div className='flex '>
                                                                                    <p className='text-green-500 text-xl font-bold'>Net Gain: +32 seats</p>


                                                                                </div>


                                                                            </motion.div>
                                                                        )}

                                                                    </div>



                                                                    <div className="w-full bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center w-[250px] p-5">
                                                                        {parlParties.second_parl_party && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}>
                                                                                <div className="w-full grid grid-cols-6 gap-5 items-center justify-center">



                                                                                    <div

                                                                                        className="col-span-3 flex items-center justify-center">
                                                                                        <div className='text-center'>
                                                                                            <img src={`${baseUrlMedia}${parlParties.second_parl_party.party_logo}`} alt="Image 1" className="rounded h-[70px] w-[70px] object-contain" />
                                                                                            <p className='text-white text-lg font-bold'>{parlParties.second_parl_party.party_initial}</p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div

                                                                                        className='col-span-3'>
                                                                                        <div className=''>
                                                                                            <p className='text-white text-3xl font-bold items-center justify-center text-center'>{parlParties.second_parl_party.seats}</p>
                                                                                            <p className='text-white text-2xl items-center justify-center text-center'>seats</p>

                                                                                        </div>
                                                                                    </div>


                                                                                </div>

                                                                                <div className='flex '>
                                                                                    <p className='text-black text-xl font-bold'>2020: </p>
                                                                                    <p className='text-black text-xl'>145 seats - 47%</p>


                                                                                </div>

                                                                                <div className='flex '>
                                                                                    <p className='text-black text-xl font-bold'>2016: </p>
                                                                                    <p className='text-black text-xl'>145 seats - 47%</p>


                                                                                </div>

                                                                                <div className='flex '>
                                                                                    <p className='text-green-500 text-xl font-bold'>Net Gain: +32 seats</p>


                                                                                </div>


                                                                            </motion.div>
                                                                        )}

                                                                    </div>







                                                                </motion.div>
                                                            )}

                                                        </>
                                                    )
                                                )}

                                            </motion.div>


                                        </div>
                                    </div>



                                    <div className='col-span-2' style={{ zIndex: 1000 }}>
                                        <div className='grid grid-cols-2'>
                                            <div className='mr-2'>
                                                <div className={`rounded-full ${electionLevel === 'Presidential' ? 'bg-blue-500' : 'bg-gray-500'} shadow-lg p-2 flex items-center justify-center`} onClick={() => handleElectionLevelClick('Presidential')}>
                                                    <p className="text-white text-center text-sm">Presidential</p>
                                                </div>
                                            </div>

                                            <div>
                                                <div className={`rounded-full ${electionLevel === 'Parliamentary' ? 'bg-blue-500' : 'bg-gray-500'} shadow-lg p-2 flex items-center justify-center`} onClick={() => handleElectionLevelClick('Parliamentary')}>
                                                    <p className="text-white text-center text-sm">Parliamentary</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex justify-end '>
                                            <div className="w-40 rounded-full bg-red-500 shadow-lg p-2 flex items-center justify-center mt-2">
                                                <button className="text-white" onClick={toggleModal}>History</button>
                                            </div>
                                        </div>

                                        <br />

                                        <div className='flex justify-end mt-[100px] '>
                                            <div className={`rounded-full w-40 mt-2 ${resultState === 'General' ? 'bg-blue-500' : 'bg-gray-500'} shadow-lg p-2 flex items-center justify-center`} onClick={() => handleResultStateClick('General')}>
                                                <button className="text-white">General</button>
                                            </div>
                                        </div>
                                        <div className='flex justify-end '>
                                            <div className={`rounded-full w-40 mt-2 ${resultState === 'Region' ? 'bg-blue-500' : 'bg-gray-500'} shadow-lg p-2 flex items-center justify-center`} onClick={() => handleResultStateClick('Region')}>
                                                <button className="text-white">Region</button>
                                            </div>
                                        </div>

                                        <div className='flex justify-end'>
                                            <div className={`rounded-full w-40 mt-2 ${resultState === 'Constituency' ? 'bg-blue-500' : 'bg-gray-500'} shadow-lg p-2 flex items-center justify-center`} onClick={() => handleResultStateClick('Constituency')}>
                                                <button className="text-white">Constituencies</button>
                                            </div>
                                        </div>

                                        <div className='flex justify-end'>
                                            <div className={`rounded-full w-40 mt-2 ${resultState === 'Electoral Area' ? 'bg-blue-500' : 'bg-gray-500'} shadow-lg p-2 flex items-center justify-center`} onClick={() => handleResultStateClick('Electoral Area')}>
                                                <button className="text-white">Electoral Areas</button>
                                            </div>
                                        </div>

                                        <div className='flex justify-end'>
                                            <div className={`rounded-full w-40 mt-2 ${resultState === 'Polling Station' ? 'bg-blue-500' : 'bg-gray-500'} shadow-lg p-2 flex items-center justify-center`} onClick={() => handleResultStateClick('Polling Station')}>
                                                <button className="text-white">Polling Stations</button>
                                            </div>
                                        </div>
                                        {showHistoryModal && (
                                            <div className="fixed w-[120px] top-[120px] right-[50px] rounded h-[450px] bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in animate-fade-out">

                                                <div>

                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("1992")}>1992</p>
                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("1996")}>1996</p>
                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("2000")}>2000</p>
                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("2000R")}>2000R</p>
                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("2004")}>2004</p>
                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("2008")}>2008</p>
                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("2008R")}>2008R</p>
                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("2012")}>2012</p>
                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("2016")}>2016</p>
                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("2020")}>2020</p>
                                                    <p className="text-white text-center text-sm m-5" onClick={() => handleElectionYearClick("2024")}>2024</p>

                                                </div>
                                            </div>
                                        )}
                                    </div>



                                </div>







                            </MapGL>
                        )}
                    </div>
                </div>
            </div>
     


            {showDisplayNameModal && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
                    <div className=" p-5 rounded-lg">
                        <h2>Regions</h2>
                        <div className='grid gap-4 grid-cols-4 grid-rows-2'>
                            {displayNameList.map((displayName) => (
                                <div key={displayName} className="relative" onClick={(e) => handleRegionNameClick(displayName, e)}>

                                    <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">

                                        <div>

                                            <p className="text-white text-xl font-bold text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{displayName}</p>


                                        </div>

                                    </div>


                                </div>
                            ))}
                        </div>





                    </div>
                </div>
            )}

        </div>
    );
};

export default MapView;
