import React, { useEffect, useState } from 'react'
import { AgGauge } from 'ag-charts-react'
import { AgRadialGaugeOptions } from 'ag-charts-enterprise'
import 'ag-charts-enterprise'

type GaugeChartProps = {
  value: number
  min: number
  max: number
  label: string
  withPercentage?: boolean
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, label, withPercentage=true, min, max }) => {
    const getColorForValue = (value: number) => {
        const baseCalc=max/3
        if (value <= baseCalc) return 'red';  
        if (value <= 2*baseCalc) return 'orange';

        return 'green';
      };
    
  const [options, setOptions] = useState<AgRadialGaugeOptions>({
    type: 'radial-gauge',
    value: value,
    footnote: { text: withPercentage?`${value}%`:`${value}`, fontFamily: 'vazir', fontSize: 16, fontWeight: 'bold' },
    spacing: 0,
    title: { text: `${label}`, fontFamily: 'vazir', fontSize: 16, fontWeight: 'bold' },
    scale: {
      min: min,
      max: max,
      label: {
        enabled: true,
        formatter({ value }) {
            return value === min || value === max ? `${value}` : '';
          },
      }
    },
    padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    needle: {
      enabled: true,
      fill: '#009DFF'
    },
    bar: {
      enabled: true,
      fill:getColorForValue(value)
    }
  })

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      value: value,
      footnote: {
        ...prevOptions.footnote,
        text: withPercentage ? `${value}%` : `${value}`
      },
      bar: {
        ...prevOptions.bar,
        fill: getColorForValue(value)
      }
    }));
  }, [value]);

  return <AgGauge options={options as any} style={{ width: '100%', height: '250px' }} />; // Set width and height as needed
}

export default GaugeChart
