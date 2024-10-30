// import React, { useEffect, useState } from 'react'
// import { AgGauge } from 'ag-charts-react'
// import { AgRadialGaugeOptions } from 'ag-charts-enterprise'
// import 'ag-charts-enterprise'

// type GaugeChartProps = {
//   value: number
//   min: number
//   max: number
//   lable: string
//   withPercentage?: boolean
// }

// const GaugeChart: React.FC<GaugeChartProps> = ({ value, lable, withPercentage=true, min, max }) => {
//     const getColorForValue = (value: number) => {
//         const baseCalc=max/3
//         if (value <= baseCalc) return 'red';
//         if (value <= 2*baseCalc) return 'orange';

//         return 'green';
//       };
    
//   const [options, setOptions] = useState<AgRadialGaugeOptions>({
//     type: 'radial-gauge',
//     value: value,
//     footnote: { text: withPercentage?`${value}%`:`${value}`, fontFamily: 'vazir', fontSize: 16, fontWeight: 'bold' },
//     spacing: 0,
//     title: { text: `${lable}`, fontFamily: 'vazir', fontSize: 16, fontWeight: 'bold' },
//     scale: {
//       min: min,
//       max: max,
//       label: {
//         enabled: true,
//         formatter({ value }) {
//             return value === min || value === max ? `${value}` : '';
//           },
//       }
//     },
//     padding: {
//         top: 20,
//         bottom: 20,
//         left: 20,
//         right: 20,
//       },
//     needle: {
//       enabled: true,
//       fill: '#009DFF'
//     },
//     bar: {
//       enabled: true,
//       fill:getColorForValue(value)
//     }
//   })

//   useEffect(() => {
//     setOptions((prevOptions) => ({
//       ...prevOptions,
//       value: value,
//       footnote: {
//         ...prevOptions.footnote,
//         text: withPercentage ? `${value}%` : `${value}`
//       },
//       bar: {
//         ...prevOptions.bar,
//         fill: getColorForValue(value)
//       }
//     }));
//   }, [value]);

//   return <AgGauge options={options as any} style={{ width: '100%', height: '250px' }} />; // Set width and height as needed
// }



import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';

 HighchartsMore(Highcharts);

type HighchartsGaugeChartProps = {
  value: number;
  min: number;
  max: number;
  label: string;
  withPercentage?: boolean;
};

const GaugeChart: React.FC<HighchartsGaugeChartProps> = ({ value, min, max, label, withPercentage = true }) => {
  const getColorForValue = (value: number) => {
    const baseCalc = max / 3;
    if (value <= baseCalc) return 'red';
    if (value <= 2 * baseCalc) return 'orange';
    
return 'green';
  };

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      type: 'gauge',
      plotBorderWidth: 0,
      plotShadow: false,
      height: '40%',
    },
    title: {
      text: label,
      style: { fontFamily: 'vazir', fontSize: '16px', fontWeight: 'bold' },
    },
    pane: {
      startAngle: -90,
      endAngle: 90,
      background: [],
      center: ['50%', '50%'],
      size: '110%',
    },
    yAxis: {
      min: min,
      max: max,
      tickPixelInterval: 72,
      tickPosition: 'inside',
      tickLength: 20,
      tickWidth: 2,
      minorTickInterval: undefined,
      tickInterval: 100,
      labels: {
        distance: 20,
        style: { fontSize: '14px' },
      },
      lineWidth: 0,
      plotBands: [
        {
          from: min,
          to: value, // Change this to only fill up to the value
          color: getColorForValue(value), // Color based on the current value
          thickness: 20,
        },
        {
          from: value,
          to: max, // Disable the remaining part of the bar
          color: '#d3d3d3', // Light gray or any color to indicate disabled
          thickness: 20,
        },
      ],
    },
    series: [
      {
        type: 'gauge',
        name: label,
        data: [value],
        tooltip: {
          valueSuffix: withPercentage ? ' %' : '',
        },
        dataLabels: {
          format: withPercentage ? `{y}%` : `{y}`,
          style: { fontSize: '16px' },
        },
        dial: {
          radius: '80%',
          backgroundColor: 'gray',
          baseWidth: 12,
          baseLength: '0%',
          rearLength: '0%',
        },
        pivot: {
          backgroundColor: 'gray',
          radius: 6,
        },
      } as Highcharts.SeriesGaugeOptions,
    ],
  });

  // Update the chart data when `value` changes
  useEffect(() => {

    setChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [
        {
          ...(prevOptions.series?.[0] as Highcharts.SeriesGaugeOptions),
          data: [value],
        },
      ],
      yAxis: {
        ...prevOptions.yAxis,
        plotBands: [
          {
            from: min,
            to: value, // Only color up to the current value
            color: getColorForValue(value), // Color based on the current value
            thickness: 20,
          },
          {
            from: value,
            to: max, // Remaining part as disabled
            color: '#d3d3d3', // Light gray color for disabled part
            thickness: 20,
          },
        ],
      } as Highcharts.YAxisOptions,
    }));
  }, [value, max]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default GaugeChart;
