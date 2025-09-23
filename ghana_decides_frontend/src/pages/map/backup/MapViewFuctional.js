import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../../components/SideNavigator';
import { Link } from 'react-router-dom';
import MapGL, { FullscreenControl, GeolocateControl, Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl';
import { useEffect, useState, useRef } from 'react';
import data from '../../../data/skateboard-parks.json'; // Import the JSON data
import data2 from '../../../data/ghana-locations.json';
import npp_logo from "../../assets/images/npp_logo.png";
import konedu from "../../assets/images/konedu.png";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"


const MapViewFunctional = () => {
    const [parkData, setParkData] = useState(null);
    const [selectedPark, setSelectedPark] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const mapRef = useRef(null); // Reference to the MapGL component
    const navigate = useNavigate();

    useEffect(() => {
        setParkData(data); // Set the data from the import to the state

        // Add event listener to detect clicks outside of the modal
        window.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    const handleOutsideClick = (e) => {
        // Close the modal if the click is outside of the modal content
        if (e.target.closest(".bg-white") === null) {
            setShowModal(false);
        }
    };

    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />

                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">
                        {parkData && (
                            <MapGL
                                ref={mapRef} // Assign the mapRef to the MapGL component
                                mapboxAccessToken="pk.eyJ1IjoiZGVsYWRlbS1waW5nc2hpcCIsImEiOiJjbHRubWF2eTUwOXBiMm1vNnI0MTNjZmNyIn0.c_hBpKu5mroAjOtRHuKb6Q"
                                initialViewState={{
                                    longitude: 1.0232,
                                    latitude: 7.9465,
                                    zoom: 6.1,
                                }}
                                style={{ width: " 100%", height: "100%" }}
                                mapStyle="mapbox://styles/deladem-pingship/cluv4uiay004y01p5b7es8xp0"
                            >
                                {parkData.features.map((park, index) => (
                                    <Marker
                                        key={`${park.properties.PARK_ID}-${index}`} // Using a combination of PARK_ID and index
                                        latitude={park.geometry.coordinates[1]}
                                        longitude={park.geometry.coordinates[0]}
                                    >
                                        <button
                                            onClick={e => {
                                                setSelectedPark(park);
                                                setShowModal(true); // Show the modal
                                                // Fly to the selected park's location
                                                mapRef.current.flyTo({
                                                    longitude: park.geometry.coordinates[0],
                                                    latitude: park.geometry.coordinates[1],
                                                    zoom: 10, // Adjust the zoom level as needed
                                                    speed: 1.2, // Control the flying speed
                                                    curve: 1, // Control the flying curve
                                                    easing: t => t, // Easing function
                                                });
                                            }}
                                        >
                                            <p>{park.properties.NAME}</p>
                                            <img src={npp_logo} alt="Image 1" className="rounded h-10 w-10 object-contain" />
                                        </button>
                                    </Marker>
                                ))}

                                <Source type="geojson" data={data2}>
                                    <Layer
                                        id="polygon-fill"
                                        type="fill"
                                        paint={{
                                            'fill-color': '#083',
                                            'fill-opacity': 0.8,
                                        }}
                                        onClick={e => {
                                            const features = mapRef.current.queryRenderedFeatures(e.point, { layers: ['polygon-fill'] });
                                            const polygonFeatures = features.filter(f => f.layer.id === 'polygon-fill');
                                            if (polygonFeatures.length > 0) {
                                                const park = polygonFeatures[0];
                                                setSelectedPark(park);
                                            }
                                        }}
                                    />


                                </Source>

                                <NavigationControl />
                                <GeolocateControl />
                                <FullscreenControl />
                            </MapGL>
                        )}
                    </div>
                </div>
            </div>
            {showModal && selectedPark && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className=" p-5 rounded-lg">
                        <h2>{selectedPark.properties.NAME}</h2>

                        <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 m-3 shadow-lg">
                            <div className="grid grid-cols-5 gap-1 items-center justify-center">
                                <div className="col-span-1">
                                    <img src={konedu} alt="Image 1" className="rounded" />
                                </div>
                                <div className="col-span-2 ml-3">
                                    <div>
                                        <p className='text-white' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>JOHN DRAMANI</p>
                                        <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>RAWLINGS</p>
                                    </div>
                                    <div className="">
                                        <div>
                                            <img src={npp_logo} alt="Image 1" className="rounded h-10 w-10 object-contain" />
                                            <p className='text-black text-lg font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{selectedPark.properties.NAME}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-2 text-center items-center justify-center'>
                                    <p className='text-white text-2xl text-right' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>6,345,454 votes</p>
                                    <p className='text-white text-3xl font-bold text-right' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>51.3%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MapViewFunctional;
