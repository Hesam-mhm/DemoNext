import React from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import moment from 'jalali-moment'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

moment.locale('fa', { useGregorianParser: false })

const ColumnChart: React.FC = () => {
  const [series] = React.useState([
    {
      name: 'شیفت 1',
      data: [44, 55, 57, 56, 61, 58, 63]
    },
    {
      name: 'شیفت 3',
      data: [76, 85, 101, 98, 87, 105, 91]
    },
    {
      name: 'شیفت 2',
      data: [35, 41, 36, 26, 45, 48, 52]
    }
  ])

  // Generate the last 7 days in Jalali format
  const getLast7DaysJalali = () => {
    return Array.from({ length: 7 }, (_, i) => moment().subtract(i, 'days').format('jD jMMMM')).reverse()
  }

  const [options] = React.useState<ApexOptions>({
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        startingShape: 'rounded',
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: getLast7DaysJalali()
    },
    yaxis: {
      title: {
        offsetX: -20,
        text: 'نرخ تولید'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`
      }
    }
  })

  return (
    <div>
      <div id='chart'>
        <ApexChart options={options} series={series} type='bar' height={350} />
      </div>
      <div id='html-dist'></div>
    </div>
  )
}

export default ColumnChart
