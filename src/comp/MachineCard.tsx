import { Stack, Typography } from '@mui/material';
import React from 'react';
import TimelineChart from './timeLineChart';

type MachineDataPoint = {
      x: string;
      y: [number, number]; // Timestamps (start and end time)
      fillColor: string;    // Color indicating status (on/off)
    };
    
    type MachineStatusData = {
      name: string;
      data: MachineDataPoint[];
    };
    


type MachineCardProps = {
      machineName :string,
      imageUrl:string ,
      status : boolean ,
      timeLineData : MachineStatusData[]

}

const MachineCard = ({machineName,status,timeLineData,imageUrl}:MachineCardProps) => {
    return (
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} sx={{ border: '2px solid ', borderColor: '#4c4e641f', borderRadius: '8px', height: 132 }} p={4} m={2}>
                  
        <Stack direction={"row"} >

        <Stack 
            sx={{
            width: 84,
            height: 84,
            bgcolor: "#e2e2e2",
            borderRadius: "8px",
            overflow: "hidden", // Ensures image is clipped if it's larger than container
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            }}
            >
            <img 
            src={`http://185.105.187.116:4002/static/images/${imageUrl}`}
            alt="description" 
            style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover" // Ensures image covers the container without stretching
            }} 
            />
            </Stack>        

                    <Stack direction={"column"} justifyContent={"space-between"} p={1} ml={1}>
                    <Typography fontSize={16} fontWeight={400} color={"#555555"} >{machineName}</Typography>
                    <Stack  direction={"row"}>
                    <Typography fontSize={16} fontWeight={400} color={"#555555"} >وضعیت   :</Typography>
                    <Typography fontSize={16} fontWeight={400} color={status?"#00B051":"red"} >{status?"فعال":"غیرفعال"}</Typography>
                    </Stack>
              </Stack>
        </Stack>

              <TimelineChart 
              machinesData={timeLineData}
              />

      </Stack>
    );
};

export default MachineCard;