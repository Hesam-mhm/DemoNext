import React from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import moment from 'jalali-moment'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

moment.locale('fa', { useGregorianParser: false })

type ColumnChartProp = {
  series: any
}

const ColumnChart: React.FC<ColumnChartProp> = ({ series }) => {
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
      categories: getLast7DaysJalali(),
      labels: {
        style: { fontFamily: 'vazir', fontSize: '14px' }
      }
    },
    yaxis: {
      title: {
        offsetX: -40,
        text: 'نرخ تولید',
        style: { fontFamily: 'vazir', fontSize: '14px' }
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
    </div>
  )
}

export default ColumnChart
