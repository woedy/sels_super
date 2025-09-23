import React from 'react';

const HistoryModal = ({ show, onClick }) => {
    return (
        <div className={`${show ? 'fixed' : 'hidden'} w-[120px] top-[120px] right-[50px] rounded h-[450px] bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in animate-fade-out`}>
            <div>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("1992")}>1992</p>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("1996")}>1996</p>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("2000")}>2000</p>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("2000R")}>2000R</p>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("2004")}>2004</p>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("2008")}>2008</p>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("2008R")}>2008R</p>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("2012")}>2012</p>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("2016")}>2016</p>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("2020")}>2020</p>
                <p className="text-white text-center text-sm m-5" onClick={() => onClick("2024")}>2024</p>
            </div>
        </div>
    );
};

export default HistoryModal;
