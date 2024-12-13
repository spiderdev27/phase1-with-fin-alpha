import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PortfolioChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Portfolio Performance',
      },
    },
  };

  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Portfolio Value',
        data: data.values,
        borderColor: 'rgb(88,28,135)',
        backgroundColor: 'rgba(88,28,135,0.5)',
      },
    ],
  };

  return <Line options={options} data={chartData} />;
};

export default PortfolioChart; 