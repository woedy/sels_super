import React from 'react';

const ResultStateButton = ({ resultState, text, onClick }) => {
    return (
        <div className='flex justify-end'>
            <div
                className={`rounded-full w-40 mt-2 ${resultState === text ? 'bg-blue-500' : 'bg-gray-500'} shadow-lg p-2 flex items-center justify-center`}
                onClick={() => onClick(text)}
            >
                <button className="text-white">{text}</button>
            </div>
        </div>
    );
};

export default ResultStateButton;
