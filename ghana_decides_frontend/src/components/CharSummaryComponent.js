import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartSummaryComponent = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartRef.current) {
            const myChartRef = chartRef.current.getContext('2d');

            chartInstance.current = new Chart(myChartRef, {
                type: 'bar',
                data: {
                    labels: ['NPP', 'NDC', 'GUM', 'CPP', 'GFP', 'GCPP', 'NDC',    'LPG', 'PNC', 'PPP', 'NDP', 'LPG', ],
                    datasets: [{
                        label: 'Presidential Results',
                        data: [90, 80, 75, 50, 40, 30, 20],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgb(0, 141, 23)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, []);

    return (
        <div className="flex justify-center ">
            
                <canvas width={600} height={250} ref={chartRef}></canvas>
          
        </div>
    );
};

export default ChartSummaryComponent;
