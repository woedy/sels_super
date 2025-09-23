import React, { useState } from 'react';

const Modal = ({ isOpen, onClose }) => {
    const [regionName, setRegionName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your logic to handle form submission (e.g., make a POST request)
        // After submitting the form, you can close the modal
        onClose();
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-8 rounded-lg z-50">
                <span className="absolute top-0 right-0 p-2 cursor-pointer" onClick={onClose}>Close</span>
                <h2 className="text-xl font-bold mb-4">Add Region</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Region Name:
                        <input type="text" value={regionName} onChange={(e) => setRegionName(e.target.value)} />
                    </label>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Add</button>
                </form>
            </div>
        </div>
    );
};
