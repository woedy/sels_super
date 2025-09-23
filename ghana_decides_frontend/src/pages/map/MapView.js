import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import MapGL, { FullscreenControl, GeolocateControl, Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl';
import { useEffect, useState, useRef } from 'react';
import data2 from '../../data/ghana-locations.json';
import konedu from "../../assets/images/konedu.png";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"
import MapSideNav from './Components/MapSideNavigator';
import { baseUrlMedia, baseWsUrl } from '../../Constants';
import MotionWrapper from './Components/MotionWrapper';
import PresidentialCandidates from './Components/PresidentialCandidates';
import ParliamentaryParties from './Components/ParliamentaryParties';
import RegionNameModal from './Components/RegionNameModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faRedo, faRobot, faMicrochip, faBrain } from '@fortawesome/free-solid-svg-icons';
import AiModal from './Components/AiModal';
import ResultStateButton from './Components/ResultStateButton';

import * as turf from '@turf/turf';


const MapView = () => {
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [showRegionNameModal, setShowDisplayNameModal] = useState(false); // State to manage modal visibility
    const [showAiModal, setShowAiModal] = useState(false);

    const mapRef = useRef(null); // Reference to the MapGL component
    const navigate = useNavigate();

    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const [resultState, setResultState] = useState("General");
    const [regionName, setRegionName] = useState("All Regions");
    const [electionLevel, setElectionLevel] = useState("Presidential");
    const [electionYear, setElectionYear] = useState("2024");
    const [candidates, setCandidates] = useState([]);
    const [regionNameList, setDisplayNameList] = useState([]);
    const [parlParties, setParlParties] = useState({});
    const [selectedYear, setSelectedYear] = useState(null);

    const [regionGeojson, setRegionGeojson] = useState({});


    const toggleAIModal = () => {
        setShowAiModal(!showAiModal);
    };


    const toggleModal = () => {
        setShowHistoryModal(!showHistoryModal);
    };

    useEffect(() => {

        // Add event listener to detect clicks outside of the modal
        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);



    useEffect(() => {
        const socket = new WebSocket(process.env.REACT_APP_BASE_URL_WS_URL  + 'ws/live-map-consumer/');

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
                setRegionGeojson(data.payload.data.region_geojson_data)
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
                setRegionGeojson(data.payload.data.region_geojson_data)

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
        if (regionName !== option) {
            setRegionName(option);
            setResultState("Region");

        }
    };




    const handleElectionLevelClick = (option) => {
        if (electionLevel !== option) {
            setElectionLevel(option);

        }
    };





    const handleResultStateClick = (option) => {
        if (option == "General") {
            handleResetClick()
        }
        setResultState(option);

    };


    const handleElectionYearClick = (year) => {
        setElectionYear(year);
        setShowHistoryModal(false); // Close the modal after selecting a year
    };

    const handleRegionClick = (e) => {
        const feature = e.features[0];
        if (feature) {
            const { region_id, region_name } = feature.properties;
            console.log('Region ID:', region_id);
            console.log('Region Name:', region_name);
    
            // Check if the clicked region is different from the current regionName
            if (region_name !== regionName) {
                // Set the region name in state
                setResultState("Region");
                setRegionName(region_name);
    
                const bbox = turf.bbox(feature); // Calculate the bounding box of the clicked feature
                const padding = 0.1; // Padding as a fraction of the map viewport
    
                // Calculate the new center point shifted to the right
                const center = [
                    (bbox[0] + bbox[2]) / 2 - 0.7, // Shifted to the right by 0.1
                    (bbox[1] + bbox[3]) / 2 + 0.25
                ];
    
                mapRef.current.fitBounds(
                    [
                        [bbox[0] - padding, bbox[1] - padding],
                        [bbox[2] + padding, bbox[3] + padding]
                    ],
                    {
                        padding: { top: 50, bottom: 50, left: 50, right: 50 }, // Add padding around the bounding box
                        maxZoom: 16, // Maximum zoom level
                        pitch: 50, // Set the pitch of the map (0-60 for most use cases)
                        center: center, // Set the new center point,
                        transitionDuration: 500, // Transition duration in milliseconds
                        speed: 1, // Adjust speed for smooth transition
                        curve: 1, // Adjust curve for smooth transition
                        essential: true, // Make sure the transition is considered 
                    }
                );
            }
        }
    };
    
    
    const handleResetClick = () => {

        setRegionName("All Regions");
        setResultState("General");
        mapRef.current.flyTo({
            center: [-3.9, 8.6], // Adjust to initial center
            zoom: 6, // Adjust to initial zoom level
            bearing: 0, // Set bearing to 0 to align the map straight
            pitch: 0, // Set pitch to 0 to reset any tilt
            speed: 1, // Adjust speed for smooth transition
            curve: 1, // Adjust curve for smooth transition
            essential: true, // Make sure the transition is considered essential
        });
    };

    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-15 gap-5 h-screen w-screen ">


                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center relative">

                        {data2 && (
                            <MapGL
                                ref={mapRef} // Assign the mapRef to the MapGL component
                                mapboxAccessToken="pk.eyJ1IjoiZGVsYWRlbS1waW5nc2hpcCIsImEiOiJjbHRubWF2eTUwOXBiMm1vNnI0MTNjZmNyIn0.c_hBpKu5mroAjOtRHuKb6Q"
                                initialViewState={{
                                    longitude: -3.9,
                                    latitude: 8.6,
                                    zoom: 6,
                                }}
                                style={{ width: "100%", height: "100%" }}
                                mapStyle="mapbox://styles/deladem-pingship/cluv4uiay004y01p5b7es8xp0"
                                interactiveLayerIds={['region-fill']} // Specify the layer for interaction
                                onClick={handleRegionClick}
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
                                <Source type="geojson" data={regionGeojson}>
                                    <Layer
                                        id="region-fill"
                                        type="fill"
                                        paint={{
                                            'fill-color': ['get', 'leading_color'],
                                            //'fill-color':"#1F45FC"
                                            'fill-opacity': 0.9,
                                        }}
                                    />
                                    <Layer
                                        id="region-stroke"
                                        type="line"
                                        paint={{
                                            'line-color': 'white', // Change this to your desired stroke color
                                            'line-width': 2, // Change this to your desired stroke width
                                        }}
                                    />

                                    <Layer
                                        id="region-label"
                                        type="symbol"
                                        layout={{
                                            'text-field': ['get', 'region_name'],
                                            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                                            'text-size': 10,
                                            'text-offset': [0, 0],
                                            
                                        }}
                                        paint={{
                                            'text-color': 'black',
                                        
                                        }}
                                    />
                                </Source>


                                {/*      <NavigationControl position='bottom-right' />
                                <GeolocateControl position='bottom-right' />
                                <FullscreenControl position='bottom-right' /> */}
                                <div className="grid grid-cols-12 gap-5 h-screen w-screen p-5">
                                    <MapSideNav />

                                    <div className="col-span-9 rounded-lg flex items-start justify-center">
                                        <div className='grid grid-cols-2 w-full'>

                                            <div className="col-span-2 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg rounded-lg flex items-start justify-left z-10 p-4 mb-3">
                                                <div className='grid grid-cols-2 gap-5 w-full '>
                                                    <div>
                                                        <p className='text-black text-left text-[15px] font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{resultState}</p>
                                                        <div className='flex flex-row '>
                                                            <p className='text-white text-left text-2xl font-bold uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{regionName}</p>

                                                            <div className='rounded-full p-2 items-center text-sm justify-center ml-2 bg-white bg-opacity-20' style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }} onClick={() => setShowDisplayNameModal(true)} >
                                                                <FaChevronDown className='text-white items-center text-sm justify-center mt-1' />

                                                            </div>
                                                        </div>

                                                        <p className='text-green-700 text-left text-sm font-bold uppercase' >{electionLevel}</p>
                                                    </div>

                                                    <div className='flex items-center justify-center'>
                                                        <p className='text-black text-left text-[40px] font-black' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>ELECTION {electionYear}</p>
                                                    </div>

                                                </div>


                                            </div>




                                            <MotionWrapper>
                                                {electionLevel === 'Presidential' ? (
                                                    <PresidentialCandidates candidates={candidates} baseUrlMedia={process.env.REACT_APP_BASE_URL} state={resultState}/>
                                                ) : (
                                                    <ParliamentaryParties parlParties={parlParties} baseUrlMedia={process.env.REACT_APP_BASE_URL} />
                                                )}
                                            </MotionWrapper>



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
                                        {/* 
                                        <div>
                                            <ResultStateButton resultState={resultState} text="General" onClick={handleResultStateClick} />
                                            <ResultStateButton resultState={resultState} text="Region" onClick={handleResultStateClick} />
                                            <ResultStateButton resultState={resultState} text="Constituency" onClick={handleResultStateClick} />
                                            <ResultStateButton resultState={resultState} text="Electoral Area" onClick={handleResultStateClick} />
                                            <ResultStateButton resultState={resultState} text="Polling Station" onClick={handleResultStateClick} />
                                        </div> */}


                                        <div className="absolute bottom-4 right-4 flex justify-end">

                                            <div
                                                className={`rounded-full w-16 h-16 bg-green-500 shadow-lg flex items-center justify-center mb-[100px]`}
                                                onClick={toggleAIModal}
                                            >
                                                <FontAwesomeIcon icon={faRobot} className="text-white" size="2x" />



                                            </div>


                                        </div>


                                        <div className="absolute bottom-4 right-4 flex justify-end">

                                            <div
                                                className={`rounded-full w-16 h-16 bg-green-500 shadow-lg flex items-center justify-center`}
                                                onClick={handleResetClick}
                                            >
                                                <FontAwesomeIcon icon={faRedo} className="text-white" size="2x" />
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


            <RegionNameModal
                showRegionNameModal={showRegionNameModal}
                regionNameList={regionNameList}
                handleRegionNameClick={handleRegionNameClick}
            />

            {showAiModal && <AiModal onClose={toggleAIModal} />}



        </div>
    );
};

export default MapView;
