import React from 'react';
import PartyCard from './PartyCard';
import { motion } from "framer-motion"


const ParliamentaryParties = ({ parlParties, baseUrlMedia }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1 },
        }}
        className="flex grid grid-cols-2 gap-2 mt-[100px]"
    >
        <PartyCard party={parlParties.first_parl_party} baseUrlMedia={baseUrlMedia} />
        <PartyCard party={parlParties.second_parl_party} baseUrlMedia={baseUrlMedia} />
    </motion.div>
);

export default ParliamentaryParties;
