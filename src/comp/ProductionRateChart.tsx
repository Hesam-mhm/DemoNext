import React from 'react';
import dynamic from "next/dynamic";

// Dynamically import the ApexCharts component to prevent SSR
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ProductionRateChart: React.FC = () => {
  const generateTimeLabels = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      times.push(`${formattedHour}:00`, `${formattedHour}:30`);
    }
    
return times;
  };

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
        
      bar: {
        horizontal: false,
        columnWidth: '50%',
        startingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#00BFFF'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.7,
      },
    },
    xaxis: {
      categories: generateTimeLabels(), // Generate time intervals
      labels: {
        show: false,
        offsetY:40,
        rotate: -90,  // Rotate labels vertically
        style: {
          fontSize: '12px',
        },
      },
    },
    
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },

    
  };

  const series = [
    {
      name: 'Rate',
      data: [20, 40, 30, 50, 70, 60, 50, 40, 30, 60, 70, 90, 80, 70, 60, 40, 30, 50, 70, 80, 60, 50, 30, 40, 50, 60, 40, 50, 70, 60, 40, 50, 30, 50, 40, 60, 70, 50, 60, 70, 40, 60, 50, 70, 80, 60, 70, 50], // Example data
    },
  ];

  return (
      <ApexChart options={options} series={series} type="bar" height={300} width={"100%"}/>
  );
};

export default ProductionRateChart;
