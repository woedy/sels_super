import React from 'react';
import { motion } from 'framer-motion';

const PartyCard = ({ party, baseUrlMedia }) => (
    <div className="w-full bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center w-[250px] p-5">
        {party && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            >
                <div className="w-full grid grid-cols-6 gap-5 items-center justify-center">
                    <div className="col-span-3 flex items-center justify-center">
                        <div className="text-center">
                            <img
                                src={`${baseUrlMedia}${party.party_logo}`}
                                alt="Party Logo"
                                className="rounded h-[70px] w-[70px] object-contain"
                            />
                            <p className="text-white text-lg font-bold">{party.party_initial}</p>
                        </div>
                    </div>
                    <div className="col-span-3">
                        <div>
                            <p className="text-white text-3xl font-bold text-center">
                                {party.seats}
                            </p>
                            <p className="text-white text-2xl text-center">seats</p>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <p className="text-black text-xl font-bold">2020: </p>
                    <p className="text-black text-xl">145 seats - 47%</p>
                </div>
                <div className="flex">
                    <p className="text-black text-xl font-bold">2016: </p>
                    <p className="text-black text-xl">145 seats - 47%</p>
                </div>
                <div className="flex">
                    <p className="text-green-500 text-xl font-bold">Net Gain: +32 seats</p>
                </div>
            </motion.div>
        )}
    </div>
);

export default PartyCard;
