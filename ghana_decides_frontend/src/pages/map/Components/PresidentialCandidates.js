import React from 'react';
import CandidateCard from './CandidateCard';

const PresidentialCandidates = ({ candidates, baseUrlMedia, state }) => (
    <>
        {candidates && candidates.map(candidate => (
            <CandidateCard
                key={candidate.election_prez_id}
                candidate={candidate}
                baseUrlMedia={baseUrlMedia}

                state={state}
            />
        ))}
    </>
);

export default PresidentialCandidates;
