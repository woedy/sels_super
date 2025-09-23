import React, { useState, useEffect } from 'react';

const DateTimeDisplay = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="absolute bottom-10 left-10 p-2 rounded">
            <p className='font-bold text-4xl' style={{ textShadow: '3px 3px 0 white, -2px -2px 0 white, 3px -3px 0 white, -3px 3px 0 white' }}>
                <span>{dateTime.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                <br />
                <span>{dateTime.toLocaleTimeString()}</span>
            </p>
        </div>
    );
};

export default DateTimeDisplay;
