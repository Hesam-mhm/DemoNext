import { Stack, Typography } from '@mui/material';
import React from 'react';
import TimeLineChart from './timeLineChart';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';


type MachineDataPoint = {
  x: string;
  y: [number, number]; // Timestamps (start and end time)
  fillColor: string;    // Color indicating status (on/off)
};

type MachineStatusData = {
  name: string;
  data: MachineDataPoint[];
};



type ProductionLineCardComponentProps ={
  departmentName : string ,
  imageUrl: string
  status : boolean ,
  machineCount : number ,
  productionRate : number ,
  timeLineData : MachineStatusData[] ,
  id :string

}

const ProductionLineCardComponent = (
  {
    departmentName ,
    status  ,
    machineCount ,
    productionRate ,
    timeLineData,
    imageUrl,
    id
  }:ProductionLineCardComponentProps
) => {

const navigate =useRouter()
  
    return (
        <Stack m={2}
        p={4}
        direction={"column"}
        sx={{ border: '2px solid ',borderColor:"#4c4e641f",borderRadius : "8px",height:282}}
       >


            <Stack direction={"row"} my={2} height={126} justifyContent={"space-between"} alignItems={"center"}>
              <Stack direction={"row"}>

                   <Stack 
                      sx={{
                        width: 126,
                        height: 126,
                        bgcolor: "#ffffff",
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
                   
              <Stack direction={"column"} justifyContent={"space-between"} ml={2} py={1}>
                       <Typography fontWeight={500} fontSize={16} color={"#555555"}>
                          {departmentName}
                       </Typography>
                        

                        <Stack direction={"row"}>

                         <Typography fontWeight={400} fontSize={15} color={"#8d8d8d"}>وضعیت :</Typography>
                         <Typography fontWeight={400} fontSize={15} color={status?"#00B051":"red"}>{status?"فعال":"غیرفعال"}</Typography>

                        </Stack>

                        <Stack direction={"row"}>

                         <Typography fontWeight={300} fontSize={14} color={"#8d8d8d"} mr={4}>{`تعداد ماشین : ${machineCount}`}</Typography>
                         <Typography fontWeight={300} fontSize={14} color={"#8d8d8d"}>
                         {` نرخ تولید : ${productionRate}`}</Typography>
                         
                        </Stack>

              </Stack>
              </Stack>


            <div onClick ={()=>{navigate.push({
              pathname:"/ProductionLineDetail",
              query:{id:id,name:departmentName}
            })}} >
              <Stack
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                height:100 ,
                width : 50,
                borderRadius:"8px",
                border:"1px solid" ,
                borderColor:"#e2e2e2",
                ":hover" :{
                  bgcolor:"#FFF5E7"
                }
              }}
              >
               <Icon icon={"formkit:left"} />
              </Stack>
            </div>
            
            </Stack>

              <TimeLineChart 
              machinesData={timeLineData}
              />


   </Stack>
    );
};

export default ProductionLineCardComponent;

