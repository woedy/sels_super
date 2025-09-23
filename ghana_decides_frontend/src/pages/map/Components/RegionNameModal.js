import React from 'react';

const RegionNameModal = ({ showRegionNameModal, regionNameList, handleRegionNameClick }) => {
    return (
        <>
            {showRegionNameModal && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="p-5 rounded-lg">
                        <div className="flex items-center justify-center">
                            <h2 className="text-white text-xl font-bold" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>Regions</h2>
                        </div>
                        <div className="grid gap-4 grid-cols-4 grid-rows-2">
                            {regionNameList.map((regionName) => (
                                <div key={regionName} className="relative" onClick={(e) => handleRegionNameClick(regionName, e)}>
                                    <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
                                        <div>
                                            <p className="text-white text-xl font-bold text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>{regionName}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegionNameModal;
