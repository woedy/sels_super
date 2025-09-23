import React from 'react';

const BackgroundImage = ({ imageUrl, children }) => {
    return (
        <div className="h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
            {children}
        </div>
    );
};

export default BackgroundImage;
