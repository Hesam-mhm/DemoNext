import moment from "moment";

type MachineDataPoint = {
  x: string;
  y: [number, number];
  fillColor: string;
};

type MachineStatusData = {
  name: string;
  data: MachineDataPoint[];
}[];

function getRandomTime(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomData(machineName: string, startDate: string, intervals: number): MachineStatusData {
  const data: MachineDataPoint[] = [];
  let currentStart = moment.utc(startDate, "YYYY-MM-DD HH:mm").valueOf();
  
  for (let i = 0; i < intervals; i++) {
    const duration = getRandomTime(1, 6) * 60 * 60 * 1000; // random duration between 1 to 6 hours
    const nextStart = currentStart + duration;
    
    data.push({
      x: "Status",
      y: [currentStart, nextStart],
      fillColor: i % 2 === 0 ? "#dff5e9" : "#f00", // alternate between green and red
    });

    currentStart = nextStart;
  }

  return [{
    name: machineName,
    data,
  }];
}
export default generateRandomData
