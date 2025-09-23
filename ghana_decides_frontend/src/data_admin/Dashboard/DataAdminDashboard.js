import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import DataAdminSideNav from "../components/DataAdminSideNavigator";
import { baseWsUrl } from '../../Constants';
import { Link } from 'react-router-dom';

const DataAdminDashboard = () => {
    const [regionsCount, setRegionsCount] = useState(0);
    const [constituenciesCount, setConstituenciesCount] = useState(0);
    const [electoralAreaCount, setElectoralAreaCount] = useState(0);
    const [pollingStationCount, setPollingStationCount] = useState(0);
    const [partiesCount, setPartyCount] = useState(0);
    const [presidentialCandidatesCount, setPresidentialCandidateCount] = useState(0);
    const [parliamentaryCandidatesCount, setParliamentaryCandidateCount] = useState(0);

    useEffect(() => {
        const socket = new WebSocket(baseWsUrl + 'ws/data-admin-dashboard/');

        socket.onopen = () => {
            console.log('WebSocket connected');

            const payload = {
                command: 'get_data_admin',
                user_id: 'ewrwerfsd'
            };

            socket.send(JSON.stringify(payload));
        };


        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.payload && data.payload.message === 'Successful') {
                setRegionsCount(data.payload.regions_count);
                setConstituenciesCount(data.payload.constituencies_count);
                setElectoralAreaCount(data.payload.electoral_areas_count);
                setPollingStationCount(data.payload.polling_stations_count);
                setPartyCount(data.payload.parties_count);
                setPresidentialCandidateCount(data.payload.presidential_candidates_count);
                setParliamentaryCandidateCount(data.payload.parliamentary_candidates_count);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">
                    <DataAdminSideNav />
                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex flex-col justify-center items-center p-5">
                        <h2 className="text-white text-3xl font-bold mb-5 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                            SUMMARY
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">

                            <Link to='/list-all-regions'>
                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 shadow-md">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500  text-4xl mr-3 " />
                                    <div className="flex-1">
                                        <p className="text-white text-xl mb-1">
                                            Total Regions
                                        </p>
                                        <p className="text-white text-[50px] font-bold">
                                            {regionsCount}
                                        </p>
                                    </div>
                                </div>
                            </Link>


                            <Link to='/list-all-constituencies'>
                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 shadow-md">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500  text-4xl mr-3 " />
                                    <div className="flex-1">
                                        <p className="text-white text-xl mb-1">
                                            Total Constituencies
                                        </p>
                                        <p className="text-white text-[50px] font-bold">
                                            {constituenciesCount}
                                        </p>
                                    </div>
                                </div>
                            </Link>



                            <Link to='/list-all-electoral-areas'>
                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 shadow-md">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500  text-4xl mr-3 " />
                                    <div className="flex-1">
                                        <p className="text-white text-xl mb-1">
                                            Total Electoral Areas
                                        </p>
                                        <p className="text-white text-[50px] font-bold">
                                            {electoralAreaCount}
                                        </p>
                                    </div>
                                </div>
                            </Link>


                            <Link to='/list-all-polling-stations'>
                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 shadow-md">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500  text-4xl mr-3 " />
                                    <div className="flex-1">
                                        <p className="text-white text-xl mb-1">
                                            Total Polling Stations
                                        </p>
                                        <p className="text-white text-[50px] font-bold">
                                            {pollingStationCount}
                                        </p>
                                    </div>
                                </div>
                            </Link>



                            <Link to='/list-all-parties'>
                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 shadow-md">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500  text-4xl mr-3 " />
                                    <div className="flex-1">
                                        <p className="text-white text-xl mb-1">
                                            Total Parties
                                        </p>
                                        <p className="text-white text-[50px] font-bold">
                                            {partiesCount}
                                        </p>
                                    </div>
                                </div>
                            </Link>


                            <Link to='/list-all-presidential-candidates'>
                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 shadow-md">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500  text-4xl mr-3 " />
                                    <div className="flex-1">
                                        <p className="text-white text-xl mb-1">
                                            Total Presi. Candidates
                                        </p>
                                        <p className="text-white text-[50px] font-bold">
                                            {presidentialCandidatesCount}
                                        </p>
                                    </div>
                                </div>
                            </Link>



                            <Link to='/list-all-presidential-candidates'>
                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 shadow-md">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500  text-4xl mr-3 " />
                                    <div className="flex-1">
                                        <p className="text-white text-xl mb-1">
                                            Total Presi. Candidates
                                        </p>
                                        <p className="text-white text-[50px] font-bold">
                                            {presidentialCandidatesCount}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link to='/list-all-parliamentary-candidates'>
                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 shadow-md">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500  text-4xl mr-3 " />
                                    <div className="flex-1">
                                        <p className="text-white text-xl mb-1">
                                            Total Parli. Candidates
                                        </p>
                                        <p className="text-white text-[50px] font-bold">
                                            {parliamentaryCandidatesCount}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                        </div>
                        <h2 className="text-white text-3xl font-bold mb-5 mt-5 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                            ELECTIONS
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                            <Link to="/list-all-elections">
                                <div className="h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                        All Elections
                                    </p>
                                </div>
                            </Link>




                            <Link to="/election-2024">
                                <div className="h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                        2024 Elections
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

export default DataAdminDashboard;
