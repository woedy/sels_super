import { Link } from "react-router-dom";
import konedu from "../../assets/images/konedu.png";
import npp_logo from "../../assets/images/npp_logo.png";
import ChartComponent from '../../components/ChartComponent';
import SideNav from '../../components/SideNavigator';
import { baseUrl, baseUrlMedia, baseWsUrl, userToken } from "../../Constants";
import { motion } from "framer-motion"

import React, { useEffect, useRef, useState } from 'react';




const PresenterDashboard = () => {
    console.log(userToken);

    const [firstCandidate, setFirstCandidate] = useState({});
    const [secondCandidate, setSecondCandidate] = useState({});
    const [incomingPresidentialVotes, setIncomingPresidentialVotes] = useState([]);
    const [incomingParliamentaryVotes, setIncomingParliamentaryVotes] = useState([]);
    const [presidentialResultChart, setPresidentialResultChart] = useState([]);


    const listContainerRef = useRef(null);
    const listContainerRef2 = useRef(null);



    useEffect(() => {
        // Scroll to the bottom of the list whenever incomingVotes changes
        listContainerRef.current.scrollTo({
            top: listContainerRef.current.scrollHeight,
            behavior: 'smooth' // Optional: smoother scrolling animation
        });
    }, [incomingPresidentialVotes]);


    
    useEffect(() => {
        // Scroll to the bottom of the list whenever incomingVotes changes
        listContainerRef2.current.scrollTo({
            top: listContainerRef2.current.scrollHeight,
            behavior: 'smooth' // Optional: smoother scrolling animation
        });
    }, [incomingParliamentaryVotes]);


    useEffect(() => {
        const socket = new WebSocket(process.env.REACT_APP_BASE_URL_WS_URL + 'ws/presenter-dashboard/');

        socket.onopen = () => {
            console.log('WebSocket connected');

            const payload = {
                command: 'get_presenter_dashboard_data'
            };

            socket.send(JSON.stringify(payload));
        };


        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.payload && data.payload.message === 'Successful') {
                setFirstCandidate(data.payload.data.first_presidential_candidate);
                setSecondCandidate(data.payload.data.second_presidential_candidate);
                setIncomingPresidentialVotes(data.payload.data.incoming_presidential_votes);
                setIncomingParliamentaryVotes(data.payload.data.incoming_parliamentary_votes);
                setPresidentialResultChart(data.payload.data.presidential_result_chart);

                console.log(data.payload.data.presidential_result_chart)
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
        <div className="relative h-screen bg-cover bg-no-repeat bg-center w-full" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center w-full">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen p-5 overflow-hidden w-full">

                    <SideNav />

                    <div className="col-span-8 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center h-full w-full" >
                        <div className='w-full'>
                            <div className=' text-center items-center justify-center'>
                                <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PRESIDENTIAL & PARLIAMENTARY</p>

                                <p className='text-white text-lg uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Provisional Result from all Polling Stations</p>


                            </div>

                            <div class="grid gap-2 grid-cols-1 grid-rows-1 mr-6 h-full">




                                <Link to='/election-summary'>


                                    <div class="grid gap-4 grid-cols-2 grid-rows-1">
                                        {firstCandidate.first_presidential_candidate && (

                                            <>

                                                <div className="">



                                                    <motion.div
                                                        initial={{ opacity: 0, y: -20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                                        className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center w-full h-60 m-3" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                                        <div className="h-full w-full  relative">
                                                            <div className="h-32 w-32 bg-black bg-opacity-25 absolute top-2 right-2/3 transform -translate-y-1/4 rounded-2xl flex justify-center items-center overflow-hidden">
                                                                <div className=' '>
                                                                    <img src={`${process.env.REACT_APP_BASE_URL}${firstCandidate.first_presidential_candidate.candidate.photo}`} alt="Image 1" className="rounded h-full w-full object-cover" />

                                                                </div>



                                                            </div>

                                                            <div className={`grid grid-cols-4 gap-2 ${firstCandidate.first_presidential_candidate.total_votes > 0 ? 'border border-green-500 border-8' : ''} rounded h-full`}>
    <div className="col-span-3 ml-[200px] mt-5">
        <p className='text-white uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{firstCandidate.first_presidential_candidate.candidate.first_name} {firstCandidate.first_presidential_candidate.candidate.middle_name}</p>
        <p className='text-white text-2xl font-bold uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{firstCandidate.first_presidential_candidate.candidate.last_name}</p>
    </div>

    <div className="col-span-1 flex justify-end items-center h-20 mt-3 pr-4">
        <div className="rounded-2xl flex justify-center items-center overflow-hidden">
            <img src={`${process.env.REACT_APP_BASE_URL}${firstCandidate.first_presidential_candidate.candidate.party.party_logo}`} alt="Party Logo" className="rounded object-cover" />
        </div>
    </div>

    <div className="col-span-4 p-5">
        <div className="grid grid-cols-2 gap-1 w-full">
            <div className='col-span-1 justify-self-start'>
                <p className='text-white text-[25px]' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{firstCandidate.first_presidential_candidate.total_votes} votes </p>
                <p className='text-white text-[30px] font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{firstCandidate.first_presidential_candidate.total_votes_percent}%</p>
            </div>

            <div className='col-span-1 justify-self-end text-right mt-2'>
                <p className='text-white text-[15px]' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PARLIAMENTARY</p>
                <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{firstCandidate.first_presidential_candidate.parliamentary_seat} Seats</p>
            </div>
        </div>
    </div>
</div>


                                                        </div>
                                                    </motion.div>




                                                    {firstCandidate.parliamentary_candidate ? (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                                            className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 w-full m-3"
                                                            style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
                                                        >
                                                            <div className="grid grid-cols-12 gap-3 justify-center items-center">
                                                                <div className="col-span-2 flex justify-start">
                                                                    <div className="h-20 w-20 rounded flex justify-center items-center overflow-hidden">
                                                                        <img src={`${process.env.REACT_APP_BASE_URL}${firstCandidate.parliamentary_candidate.candidate.photo}`} alt="Candidate" className="rounded object-cover" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-4">
                                                                    <div>
                                                                        <p className='text-white uppercase'>{firstCandidate.parliamentary_candidate.candidate.first_name} {firstCandidate.parliamentary_candidate.candidate.middle_name}</p>
                                                                        <p className='text-white font-bold uppercase'>{firstCandidate.parliamentary_candidate.candidate.last_name}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-4 flex items-center justify-center">
                                                                    <div className='col-span-1'>
                                                                        <p className='text-white text-sm'>Constituency</p>
                                                                        <p className='text-white text-lg font-bold uppercase'>{firstCandidate.parliamentary_candidate.candidate.constituency.constituency_name}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ) : null}
                                                </div>


                                            </>
                                        )}




                                        {secondCandidate.second_presidential_candidate && (

                                            <>

                                                <div>


                                                    <motion.div
                                                        initial={{ opacity: 0, y: -20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                                        className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center w-full h-60 m-3" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                                        <div className="h-full w-full  relative">
                                                            <div className="h-32 w-32 bg-black bg-opacity-25 absolute top-2 left-2/3 transform -translate-y-1/4 rounded-2xl flex justify-center items-center overflow-hidden">
                                                                <div className=' '>
                                                                    <img src={`${process.env.REACT_APP_BASE_URL}${secondCandidate.second_presidential_candidate.candidate.photo}`} alt="Image 1" className="rounded h-full w-full object-cover" />

                                                                </div>



                                                            </div>
                                                            <div className="grid grid-cols-4 gap-1 rounded h-full">
                                                                <div className="h-20 w-20 mt-3 ml-3 rounded-2xl flex justify-start items-center overflow-hidden ml-4">
                                                                    <img src={`${process.env.REACT_APP_BASE_URL}${secondCandidate.second_presidential_candidate.candidate.party.party_logo}`} alt="Image 1" className="rounded object-cover" />

                                                                </div>
                                                                <div className="col-span-3 ml- mt-5">
                                                                    <p className='text-white uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{secondCandidate.second_presidential_candidate.candidate.first_name} {secondCandidate.second_presidential_candidate.candidate.middle_name}</p>

                                                                    <p className='text-white text-2xl font-bold uppercase' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{secondCandidate.second_presidential_candidate.candidate.last_name}</p>


                                                                </div>



                                                                <div className="col-span-4 p-5 ">

                                                                    <div className="grid grid-cols-2 gap-1 w-full">

                                                                        <div className='col-span-1 justify-self-start'>
                                                                            <p className='text-white text-[25px]' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{secondCandidate.second_presidential_candidate.total_votes} votes </p>
                                                                            <p className='text-white text-[30px] font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{secondCandidate.second_presidential_candidate.total_votes_percent}%</p>


                                                                        </div>


                                                                        <div className='col-span-1 justify-self-end text-right mt-2'>

                                                                            <p className='text-white text-[15px]' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PARLIAMENTARY</p>
                                                                            <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{secondCandidate.second_presidential_candidate.parliamentary_seat} Seats</p>

                                                                        </div>

                                                                    </div>

                                                                </div>




                                                            </div>


                                                        </div>


                                                    </motion.div>


                                                    {secondCandidate.parliamentary_candidate ? (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                                            className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 w-full m-3"
                                                            style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
                                                        >
                                                            <div className="grid grid-cols-12 gap-3 justify-center items-center">
                                                                <div className="col-span-2 flex justify-start">
                                                                    <div className="h-20 w-20 rounded flex justify-start items-center overflow-hidden">
                                                                        <img src={`${process.env.REACT_APP_BASE_URL}${secondCandidate.parliamentary_candidate.candidate.photo}`} alt="Candidate" className="rounded object-cover" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-4">
                                                                    <div>
                                                                        <p className='text-white uppercase'>{secondCandidate.parliamentary_candidate.candidate.first_name} {secondCandidate.parliamentary_candidate.candidate.middle_name}</p>
                                                                        <p className='text-white font-bold uppercase'>{secondCandidate.parliamentary_candidate.candidate.last_name}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-4 flex items-center justify-center">
                                                                    <div className='col-span-1'>
                                                                        <p className='text-white text-sm'>Constituency</p>
                                                                        <p className='text-white text-lg font-bold uppercase'>{secondCandidate.parliamentary_candidate.candidate.constituency.constituency_name}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ) : null}
                                                </div>


                                            </>
                                        )}




                                    </div>



                                </Link>



                                <div className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex text-center items-center justify-center p-3 w-full h m-3" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                    <div className=''>
                                        <p className='text-white text-2xl font-bold' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>2024 PRESIDENTIAL RESULTS</p>

                                        <Link to='/election-summary-chart'>
                                            <ChartComponent presidentialResultChart={presidentialResultChart} />
                                        </Link>



                                    </div>

                                </div>



                            </div>



                        </div>




                    </div>



                    <div className="col-span-3 p-4 h-screen bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">
                        <div className="flex flex-col w-full h-full">

                            <p className='text-white font-bold text-center mb-1' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PRESIDENTIAL REALTIME</p>

                            <div className="flex w-full h-1/2">
                                <div className="w-full h-full overflow-auto hide-scrollbar" ref={listContainerRef}>
                                    {incomingPresidentialVotes && [...incomingPresidentialVotes].map((incomingVote, index) => (
                                        <motion.div key={index}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                            className="bg-green-500 bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 w-full mb-3" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                            {incomingVote.candidate && (
                                                <div className="grid grid-cols-5 gap-1">
                                                    <div className="col-span-1">
                                                        <div className="h-15 w-15 rounded-2xl flex justify-center items-center overflow-hidden">
                                                            <img src={`${process.env.REACT_APP_BASE_URL}${incomingVote.candidate.candidate.photo}`} alt="Candidate" className="rounded object-cover" />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <div>
                                                            <p className='text-white uppercase'>{incomingVote.candidate.candidate.first_name} {incomingVote.candidate.candidate.middle_name}</p>
                                                            <p className='text-white text-2xl font-bold uppercase'>{incomingVote.candidate.candidate.last_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1 flex items-center justify-center">
                                                        <div>
                                                            <div className="h-10 w-10 rounded flex justify-center items-center overflow-hidden">
                                                                <img src={`${process.env.REACT_APP_BASE_URL}${incomingVote.candidate.candidate.party.party_logo}`} alt="Party" className="rounded object-cover" />
                                                            </div>
                                                            <p className='text-black text-lg font-bold text-center uppercase'>{incomingVote.candidate.candidate.party.party_initial}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-5 rounded bg-white bg-opacity-15 p-1">
                                                        <div className='grid grid-cols-2'>
                                                            <div className='col-span-1 ml-2'>
                                                                <p className='text-white text-lg font-bold uppercase'>{incomingVote.polling_station.polling_station_name}</p>
                                                                <p className='text-white text-sm'>Polling Station</p>
                                                            </div>
                                                            <div className='col-span-1 text-center items-center justify-center'>
                                                                <p className='text-white'>{incomingVote.total_votes} votes</p>
                                                                <p className='text-white text-xl font-bold'>{incomingVote.total_votes_percent}%</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>



                            <p className='text-white font-bold text-center mt-4' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>PARLIAMENTARY REALTIME</p>

                            <div className="flex w-full h-1/2 mt-3">
                                <div className="w-full h-full overflow-auto hide-scrollbar pb-[100px]" ref={listContainerRef2}>
                                    {incomingParliamentaryVotes && [...incomingParliamentaryVotes].map((incomingParliamentaryVote, index) => (
                                        <motion.div key={index}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                                            className="bg-red-500 bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 w-full mb-3" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                                            {incomingParliamentaryVote.candidate && (
                                                <div className="grid grid-cols-5 gap-1 ">
                                                    <div className="col-span-1">
                                                        <div className="h-15 w-15 rounded-2xl flex justify-center items-center overflow-hidden">
                                                            <img src={`${process.env.REACT_APP_BASE_URL}${incomingParliamentaryVote.candidate.candidate.photo}`} alt="Candidate" className="rounded object-cover" />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <div>
                                                            <p className='text-white uppercase'>{incomingParliamentaryVote.candidate.candidate.first_name} {incomingParliamentaryVote.candidate.candidate.middle_name}</p>
                                                            <p className='text-white text-2xl font-bold uppercase'>{incomingParliamentaryVote.candidate.candidate.last_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1 flex items-center justify-center">
                                                        <div>
                                                            <div className="h-10 w-10 rounded flex justify-center items-center overflow-hidden">
                                                                <img src={`${process.env.REACT_APP_BASE_URL}${incomingParliamentaryVote.candidate.candidate.party.party_logo}`} alt="Party" className="rounded object-cover" />
                                                            </div>
                                                            <p className='text-black text-lg font-bold text-center uppercase'>{incomingParliamentaryVote.candidate.candidate.party.party_initial}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-5 rounded bg-white bg-opacity-15 p-1">
                                                        <div className='grid grid-cols-2'>
                                                            <div className='col-span-1 ml-2'>
                                                                <p className='text-white text-lg font-bold uppercase'>{incomingParliamentaryVote.polling_station.polling_station_name}</p>
                                                                <p className='text-white text-sm'>Polling Station</p>
                                                            </div>
                                                            <div className='col-span-1 text-center items-center justify-center'>
                                                                <p className='text-white'>{incomingParliamentaryVote.total_votes} votes</p>
                                                                <p className='text-white text-xl font-bold'>{incomingParliamentaryVote.total_votes_percent}%</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PresenterDashboard;
