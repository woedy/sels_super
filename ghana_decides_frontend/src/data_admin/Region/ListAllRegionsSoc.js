import { FaPen, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { baseUrl, baseWsUrl, userToken } from '../../Constants';
import DataAdminSideNav from '../components/DataAdminSideNavigator';

const Modal = ({ isOpen, onClose, editingRegion, regionName: initialRegionName, initials: initialInitials, capital: initialCapital, mapImage: initialMapImage }) => {
    const [regionName, setRegionName] = useState(initialRegionName || '');
    const [initials, setInitials] = useState(initialInitials || '');
    const [capital, setCapital] = useState(initialCapital || '');
    const [mapImage, setMapImage] = useState(initialMapImage || null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (editingRegion) {
            setRegionName(editingRegion.region_name);
            setInitials(editingRegion.initials);
            setCapital(editingRegion.capital);
        }
    }, [editingRegion]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setMapImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true

        // Validate inputs
        if (!regionName.trim() || !initials.trim() || !capital.trim() || !mapImage) {
            setErrorMessage('All fields are required');
            setIsLoading(false); // Reset loading state
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(mapImage);
        reader.onload = () => {
            const base64Image = reader.result.split(',')[1]; // Extract base64 data

            const payload = {
                command: editingRegion ? 'edit_region' : 'add_region', // Conditionally set command
                user_id: 'ewrwerfsd',
                data: {
                    ...(editingRegion && { region_id: editingRegion.region_id }), // Include region_id if editing
                    region_name: regionName,
                    initials: initials,
                    capital: capital,
                    map_image: base64Image
                }
            };

            const socket = new WebSocket(baseWsUrl + 'ws/region-consumers/');

            socket.onopen = () => {
                console.log('WebSocket connected');
                socket.send(JSON.stringify(payload));
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.payload && data.payload.message === 'Successful') {
                    console.log(`Region ${editingRegion ? 'edited' : 'added'} successfully`);
                    onClose(); // Close the modal
                    window.location.reload();
                } else {
                    console.error(`Failed to ${editingRegion ? 'edit' : 'add'} region`);
                }
                setIsLoading(false); // Reset loading state
            };

            socket.onclose = () => {
                console.log('WebSocket disconnected');
                setIsLoading(false); // Reset loading state
            };
        };
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? 'animate-fadeIn' : 'hidden'}`} onClick={onClose}>
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg rounded-lg"></div>
            <div className="bg-white bg-opacity-25 backdrop-blur-lg p-8 rounded-lg z-50 w-[500px] " onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {errorMessage}</span>
                            </div>
                        )}
                        <div className="border-b border-gray-900/10 pb-12">
                            <h3 className="text-2xl font-bold leading-7 text-white" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Add Region</h3>
                            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label htmlFor="region-name" className="block text-sm font-medium leading-6 text-white">
                                        Region Name
                                    </label>
                                    <div className="mt-2">
                                    <select
                                            name="region-name"
                                            id="region-name"
                                            value={regionName}
                                            onChange={(e) => setRegionName(e.target.value)}
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black bg-opacity-25 text-white border-blue-400 border-opacity-50"
                                            >
                                            <option value="">Select a region</option>

                                            <option value="Ashanti">Ashanti</option>
                                            <option value="Brong Ahafo">Brong Ahafo</option>
                                            <option value="Central">Central</option>
                                            <option value="Eastern">Eastern</option>
                                            <option value="Greater Accra">Greater Accra</option>
                                            <option value="Northern">Northern</option>
                                            <option value="Upper East">Upper East</option>
                                            <option value="Upper West">Upper West</option>
                                            <option value="Volta">Volta</option>
                                            <option value="Western">Western</option>
                                            <option value="Savannah">Savannah</option>
                                            <option value="Bono East">Bono East</option>
                                            <option value="Oti">Oti</option>
                                            <option value="Ahafo">Ahafo</option>
                                            <option value="Western North">Western North</option>
                                            <option value="North East">North East</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Add similar fields for 'initials' and 'capital' */}
                                <div className="col-span-full">
                                    <label htmlFor="initials" className="block text-sm font-medium leading-6 text-gray-900 text-white">
                                        Initials
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="initials"
                                            id="initials"
                                            value={initials}
                                            onChange={(e) => setInitials(e.target.value)}
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black bg-opacity-25 text-white border-blue-400 border-opacity-50"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-full">
                                    <label htmlFor="capital" className="block text-sm font-medium leading-6 text-gray-900 text-white">
                                        Capital
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="capital"
                                            id="capital"
                                            value={capital}
                                            onChange={(e) => setCapital(e.target.value)}
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black bg-opacity-25 text-white border-blue-400 border-opacity-50"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-full">
                                    <label htmlFor="map-image" className="block text-sm font-medium leading-6 text-gray-900 text-white">
                                        Map Image
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="map-image"
                                            id="map-image"
                                            onChange={handleFileChange}
                                            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center text-white text-sm font-medium">
                                <span className="mr-2">Adding Region...</span>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0120.708 10H23.3A10 10 0 004 12.701v4.59zm14.21-1.083A8 8 0 014.699 14H1.293a10 10 0 0016.918 3.222l-1.083-1.083z"></path>
                                </svg>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {editingRegion ? "Edit Region" : "Add Region"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

const ListAllRegionsSoc = () => {
    const [regions, setRegions] = useState([]);

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editingRegion, setEditingRegion] = useState(null);
    const [regionName, setRegionName] = useState('');
    const [initials, setInitials] = useState('');
    const [capital, setCapital] = useState('');
    const [mapImage, setMapImage] = useState(null);

    const openEditModal = (region) => {
        setEditingRegion(region);
        setRegionName(region.region_name);
        setInitials(region.initials);
        setCapital(region.capital);
        setMapImage(region.map_image);
        setShowModal(true);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const socket = new WebSocket(baseWsUrl + 'ws/region-consumers/');
        
        socket.onopen = () => {
            console.log('WebSocket connected');

            const payload = {
                command: 'get_all_regions',
                user_id: 'ewrwerfsd'
            };

            socket.send(JSON.stringify(payload));
        };

        
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.payload && data.payload.message === 'Successful') {

                console.log(data.payload.data)
                setRegions(data.payload.data || []);
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

    function handleDelete(region_id) {
        const socket = new WebSocket(baseWsUrl + 'ws/region-consumers/');
    
        socket.onopen = () => {
            console.log('WebSocket connected');
    
            const payload = {
                command: 'delete_region',
                region_id: region_id
            };
    
            socket.send(JSON.stringify(payload));
        };
    
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.payload && data.payload.message === 'Successful') {
                console.log('Region deleted successfully');
                // Perform any necessary actions after successful deletion
            } else {
                console.error('Failed to delete region');
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
                                    <p className='text-white text-center text-2xl font-bold mb-3' style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>ALL REGIONS</p>
                                </div>
                                <div className='col-span-1'>
                                    <div className="rounded-full bg-blue-500 shadow-lg p-2 flex items-center justify-center cursor-pointer" onClick={openModal}>
                                        <p className="text-white text-center text-sm">Add Region</p>
                                    </div>
                                    <Modal
                                        isOpen={showModal}
                                        onClose={closeModal}
                                        editingRegion={editingRegion}
                                        regionName={regionName}
                                        setRegionName={setRegionName}
                                        initials={initials}
                                        setInitials={setInitials}
                                        capital={capital}
                                        setCapital={setCapital}
                                        mapImage={mapImage}
                                        setMapImage={setMapImage}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className='grid gap-4 grid-cols-4 grid-rows-2'>
                                    {regions.map((region) => (
                                        <div key={region.region_id} className="relative">
                                            <Link to={"/region-details/" + region.region_id}>
                                                <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                                    <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{region.region_name}</p>
                                                </div>
                                            </Link>
                                            <div className="absolute top-0 left-0 m-2">
                                                <div className="bg-blue-500 rounded-full p-2 cursor-pointer">
                                                    <FaPen className="text-white" onClick={() => openEditModal(region)} />
                                                </div>
                                            </div>
                                            <div className="absolute top-0 right-0 m-2">
                                                <div className="bg-red-500 rounded-full p-2 cursor-pointer">
                                                    <FaTimes className="text-white" onClick={() => handleDelete(region.region_id)} />
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

export default ListAllRegionsSoc;

