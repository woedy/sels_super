import { FaPen, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { baseUrl, baseWsUrl, userToken } from '../../Constants';
import DataAdminSideNav from '../components/DataAdminSideNavigator';



const  ListAllParliamentaryCandidatesSoc = () => {
    const [parliamentaryCandidates, setParliamentaryCandidate] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {
        const socket = new WebSocket(baseWsUrl + 'ws/parliamentary-candidate-consumers/');
        
        socket.onopen = () => {
            console.log('WebSocket connected');

            const payload = {
                command: 'get_all_parliamentary_candidates',
                user_id: 'ewrwerfsd'
            };

            socket.send(JSON.stringify(payload));
        };

        
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.payload && data.payload.message === 'Successful') {

                console.log(data.payload.data)
                setParliamentaryCandidate(data.payload.data || []);
            } else {
                console.error('Invalid WebSocket message:', data);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            socket.close();
        };
    }, []);

    function handleDelete(parl_can_id) {
        const socket = new WebSocket(baseWsUrl + 'ws/parliamentary-candidate-consumers/');
    
        socket.onopen = () => {
            console.log('WebSocket connected');
    
            const payload = {
                command: 'delete_parliamentary_candidate',
                parl_can_id: parl_can_id
            };
    
            socket.send(JSON.stringify(payload));
        };
    
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.payload && data.payload.message === 'Successful') {
                console.log('Parliamentary Candidate deleted successfully');
                // Perform any necessary actions after successful deletion
            } else {
                console.error('Failed to delete parliamentary candidate');
            }
        };
    
        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };
    }
    

    return (
        <div className="relative h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/ghana_decides_back.png)`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-5 mx-10 h-screen w-screen p-5">
                    <DataAdminSideNav />
                    <div className="col-span-11 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center">
                        <div>
                            <div className='grid grid-cols-5'>
                                <div className='col-span-4'>
                                    <p className='text-white text-center text-2xl font-bold mb-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>ALL CANDIDATES</p>
                                </div>
                                <div className='col-span-1'>
                                    <div className="rounded-full bg-blue-500 shadow-lg p-2 flex items-center justify-center cursor-pointer">
                                        <p className="text-white text-center text-sm">Add Parliamentary Candidate</p>
                                    </div>
                        


                                </div>
                            </div>
                            <div>
                                <div className='grid gap-4 grid-cols-4 grid-rows-2'>
                                    {parliamentaryCandidates.map((candidate) => (
                                        <div key={candidate.parl_can_id} className="relative">
                                            <Link to={"/parliamentary-candidate-details/" + candidate.parl_can_id}>
                                                <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">

                                                    <div>

                                                    <p className="text-white text-xl font-bold text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{candidate.first_name} {candidate.last_name}</p>
                                                    <p className="text-white text-xl text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{candidate.party.party_initial}</p>


                                                    </div>

                                                </div>
                                            </Link>
                                            <div className="absolute top-0 left-0 m-2">
                                                <div className="bg-blue-500 rounded-full p-2 cursor-pointer">
                                                    <FaPen className="text-white" />
                                                </div>
                                            </div>
                                            <div className="absolute top-0 right-0 m-2">
                                                <div className="bg-red-500 rounded-full p-2 cursor-pointer">
                                                    <FaTimes className="text-white" onClick={() => handleDelete(candidate.parl_can_id)} />
                                                </div>
                                            </div>
                                        </div>
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

export default ListAllParliamentaryCandidatesSoc;

