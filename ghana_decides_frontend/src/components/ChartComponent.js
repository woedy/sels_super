import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from '@mui/x-charts';

const ChartComponent = ({ presidentialResultChart }) => {
    if (!presidentialResultChart || presidentialResultChart.length === 0) {
        return <div>No data available for chart</div>;
    }

    const data = presidentialResultChart.map(candidate => ({
        party_initial: candidate.party_initial,
        total_votes: candidate.total_votes,
    }));

    return (
        <div style={{ width: 600, height: 250 }}>
            <BarChart
                xAxis={[
                    {
                        id: 'party_initial',
                        data: data.map(candidate => candidate.party_initial),
                        scaleType: 'band',
                    },
                ]}
                series={[
                    {
                        data: data.map(candidate => candidate.total_votes),
                    },
                ]}
                width={500}
                height={280}
            />
        </div>
    );
};

export default ChartComponent;