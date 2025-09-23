import { FaHome, FaSearch, FaBell, FaTh, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import SideNav from '../../../components/SideNavigator';
import { Link } from 'react-router-dom';
import MapGL, { Marker, Popup } from 'react-map-gl';
import { useEffect, useState } from 'react';
import data from '../../../data/skateboard-parks.json'; // Import the JSON data
import npp_logo from "../../assets/images/npp_logo.png";


const MapViewCopy = () => {
    const [parkData, setParkData] = useState(null);
    const [selectedPark, setSelectedPark] = useState(null);



    useEffect(() => {
        setParkData(data); // Set the data from the import to the state
    }, []);



    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">

                    <SideNav />

                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">
                        {parkData && (
                            <MapGL
                                mapboxAccessToken="pk.eyJ1IjoiZGVsYWRlbS1waW5nc2hpcCIsImEiOiJjbHRubWF2eTUwOXBiMm1vNnI0MTNjZmNyIn0.c_hBpKu5mroAjOtRHuKb6Q"
                                initialViewState={{
                                    longitude: parkData.features[0].geometry.coordinates[0],
                                    latitude: parkData.features[0].geometry.coordinates[1],
                                    zoom: 14
                                }}
                                style={{ width: " 100%", height: "100%" }}
                                mapStyle="mapbox://styles/mapbox/streets-v9"
                            >
                                {parkData.features.map((park, index) => (
                                    <Marker
                                        key={`${park.properties.PARK_ID}-${index}`} // Using a combination of PARK_ID and index
                                        latitude={park.geometry.coordinates[1]}
                                        longitude={park.geometry.coordinates[0]}
                                    >
                                        <button
                                            onClick={e => {
                                                //e.preventDefault();
                                                setSelectedPark(park);
                                                console.log("Wewrwerewrrwer")
                                                console.log(selectedPark)


                                            }}
                                        >
                                            <img src={npp_logo} alt="Image 1" className="rounded h-10 w-10 object-contain" />
                                        </button>
                                    </Marker>
                                ))}

                                {selectedPark ? (
                                    <Popup
                                        latitude={selectedPark.geometry.coordinates[1]}
                                        longitude={selectedPark.geometry.coordinates[0]}
                                        onClose={() => {
                                            setSelectedPark(null);
                                        }}
                                    >
                                        <div>
                                            <h2>{selectedPark.properties.NAME}</h2>
                                         
                                            {selectedPark && <p>{selectedPark.properties.DESCRIPTIO}</p>}
                                        </div>
                                    </Popup>
                                ) : null}
                            </MapGL>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapViewCopy;
