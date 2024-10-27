import React from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

type RadialBarProps = {
  amount: number
  label: string
  withpercentage?: boolean
}

const RadialBar: React.FC<RadialBarProps> = ({ amount, label, withpercentage=true }) => {
  const getColor = (percentage: number) => {
    if (percentage <= 30) return '#FF0000'
    if (percentage <= 60) return '#FFA500'

    return '#008000'
  }

  const options: ApexOptions = {
    series: [amount],
    chart: {
      type: 'radialBar' as const,
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%',
          margin: 0,
          background: '#fff'
        },
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '85%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: true,
            color: '#383838',
            fontWeight: '400',
            fontSize: '14px',
            offsetY: 40
          },
          value: {
            offsetY: -10,
            fontSize: '18px',
            color: '#383838',
            formatter: (val: number) =>withpercentage? `${val}%`:`${val}`

            // formatter: (val: number) =>withpercentage? `${new Intl.NumberFormat('fa-IR').format(val)}%`:new Intl.NumberFormat('fa-IR').format(val)
          }
        }
      }
    },
    fill: {
      colors: [getColor(amount)],
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    labels: [label]
  }

  return <ApexChart options={options} series={options.series} type='radialBar' height={300} />
}

export default RadialBar
