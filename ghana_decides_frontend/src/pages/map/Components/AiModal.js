import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faSearch } from '@fortawesome/free-solid-svg-icons';

const AiModal = ({ onClose }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 w-full" onClick={onClose}>
            <div className="p-5 rounded-lg w-full m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center ">
                    <h2 className="text-white text-xl font-bold" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>SELS</h2>
                </div>

                <div className="relative block w-full m-5">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                            <FontAwesomeIcon icon={faMicrophone} className="text-slate" />
                        </div>
                    </div>
                    <input className="placeholder:italic placeholder:text-slate-400 block bg-white bg-opacity-50 w-full border border-slate-300 rounded-md py-6 pl-16 pr-10 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-2xl" placeholder="Ask me anything..." type="text" name="search" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                            <FontAwesomeIcon icon={faSearch} className="text-slate" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiModal;
