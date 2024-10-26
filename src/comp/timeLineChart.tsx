import React, { useEffect, useState } from "react";
import 'moment-timezone';
import dynamic from "next/dynamic";

// Dynamically import the ApexCharts component to prevent SSR
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartDataPoint {
  x: string;
  y: [number, number];
  fillColor: string;
}

interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
}

type MachineDataPoint = {
  x: string;
  y: [number, number]; // Timestamps (start and end time)
  fillColor: string;    // Color indicating status (on/off)
};

type MachineStatusData = {
  name: string;
  data: MachineDataPoint[];
};

type TimelineChartType = {
  machinesData :MachineStatusData[]
}

const TimelineChart = ({machinesData}:TimelineChartType) => {
  const [data, setData] = useState<MachineStatusData[]>([]);

  useEffect(() => {
    const fetchData = () => {
      setData(machinesData);
    };
    fetchData();
  }, []);

  const minDate = data.length > 0 ? Math.min(...data[0].data.map((d) => d.y[0])) : undefined;
  const maxDate = data.length > 0 ? Math.max(...data[0].data.map((d) => d.y[1])) : undefined;

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 50,
      type: "rangeBar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "100%",
        rangeBarGroupRows: true,
      },
    },
    colors: ["#008FFB", "#00E396"],
    fill: {
      type: "solid",
    },
    xaxis: {
      min: minDate,
      max: maxDate,
      type: "datetime",
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    legend: {
      position: "right",
    },
    tooltip: {
      enabled: false,
      fixed: {
        enabled: false,
        position: "topRight",
      },
      custom: ({ seriesIndex, dataPointIndex, w }: any) => {
        const start = w.globals.seriesRangeStart[seriesIndex][dataPointIndex];
        const end = w.globals.seriesRangeEnd[seriesIndex][dataPointIndex];
        const reason = w.globals.seriesNames[seriesIndex]  || "تست دلیل";
         
        console.log(w.globals.seriesNames[seriesIndex]);
        
        const willShowStart = new Date(start).toLocaleDateString("fa-IR", {
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        const willShowEnd = new Date(end).toLocaleDateString("fa-IR", {
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        return `
        از ساعت ${willShowStart} تا ساعت ${willShowEnd} به دلیل ${reason}
        `;
      },
    },
  };

  return (
        <ApexChart options={options} series={data} type="rangeBar" height={84}  width={"100%"}/>
  );
};

export default TimelineChart;
