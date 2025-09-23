import React from "react";
import { motion } from "framer-motion";

const CandidateCard = ({ candidate, baseUrlMedia, state }) => {
    console.log('################################')
    console.log(state)
    console.log(candidate)
    if (state === 'General') {
        return (

            <motion.div
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1 },
                }}
                key={candidate.election_prez_id}
                className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 m-3 shadow-lg h-[150px]"
            >
                <div className="grid grid-cols-5 gap-1 items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="col-span-1"
                    >
                        <img
                            src={`${baseUrlMedia}${candidate.candidate?.photo}`}
                            alt="Candidate"
                            className="rounded"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        className="col-span-2 ml-3"
                    >
                        <div>
                            <p
                                className="text-white uppercase"
                                style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                            >
                                {candidate.candidate?.first_name} {candidate.candidate?.middle_name}
                            </p>
                            <p
                                className="text-white text-2xl font-bold uppercase"
                                style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                            >
                                {candidate.candidate?.last_name}
                            </p>
                        </div>
                        <div>
                            <img
                                src={`${baseUrlMedia}${candidate.candidate?.party?.party_logo}`}
                                alt="Party Logo"
                                className="rounded h-10 w-10 object-contain"
                            />
                            <p
                                className="text-black text-lg font-bold"
                                style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                            >
                                {candidate.candidate?.party?.party_initial}
                            </p>
                        </div>
                    </motion.div>
                    <div className="col-span-2 text-center items-center justify-center">
                        <p
                            className="text-white text-2xl text-right"
                            style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                        >
                            {candidate?.total_votes} votes
                        </p>
                        <p
                            className="text-black text-3xl font-bold text-right"
                            style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                        >
                            {candidate?.total_votes_percent}%
                        </p>
                        <p
                            className="text-white text-xl text-right"
                            style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                        >
                            {candidate?.parliamentary_seat} seats
                        </p>
                    </div>
                </div>
            </motion.div>
        )
    }else {
        return (


            

            <motion.div
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1 },
                }}
                key={candidate.election_prez_id}
                className="bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center p-3 m-3 shadow-lg h-[150px]"
            >
                <div className="grid grid-cols-5 gap-1 items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="col-span-1"
                    >
                        <img
                            src={`${baseUrlMedia}${candidate.prez_candidate?.candidate?.photo}`}
                            alt="Candidate"
                            className="rounded"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        className="col-span-2 ml-3"
                    >
                        <div>
                            <p
                                className="text-white uppercase"
                                style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                            >
                                {candidate.prez_candidate?.candidate?.first_name} {candidate.prez_candidate?.candidate?.middle_name}
                            </p>
                            <p
                                className="text-white text-2xl font-bold uppercase"
                                style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                            >
                                {candidate.prez_candidate?.candidate?.last_name}
                            </p>
                        </div>
                        <div>
                            <img
                                src={`${baseUrlMedia}${candidate.prez_candidate?.candidate?.party?.party_logo}`}
                                alt="Party Logo"
                                className="rounded h-10 w-10 object-contain"
                            />
                            <p
                                className="text-black text-lg font-bold"
                                style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                            >
                                {candidate.prez_candidate?.candidate?.party?.party_initial}
                            </p>
                        </div>
                    </motion.div>
                    <div className="col-span-2 text-center items-center justify-center">
                        <p
                            className="text-white text-2xl text-right"
                            style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                        >
                            {candidate?.total_votes} votes
                        </p>
                        <p
                            className="text-black text-3xl font-bold text-right"
                            style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                        >
                            {candidate?.total_votes_percent}%
                        </p>
                        <p
                            className="text-white text-xl text-right"
                            style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                        >
                            {candidate?.parliamentary_seat} seats
                        </p>
                    </div>
                </div>
            </motion.div>
        )
    }
};

export default CandidateCard;
