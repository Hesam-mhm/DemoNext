import { Box, Card, Stack, Typography } from '@mui/material';
import React from 'react';
import dynamic from "next/dynamic";

// Dynamically import the ApexCharts component to prevent SSR
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ColorlyCardInProductionDetailProps ={
  donutSeries : number[],
  barSeries : {name:string , data : number[]}[] ,
  bgColor:string
  title:string
}



const ColorlyCardInProductionDetail = ({donutSeries,barSeries,bgColor,title}:ColorlyCardInProductionDetailProps) => {

    const donutOptions : ApexCharts.ApexOptions = {
        chart: {
            height: 280,
            type: "radialBar"
          },
          
          series: [67],
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 15,
                size: "60%",
              },
              track: {
                background: '#5F0000', // Set the background behind the progress line to black
                strokeWidth: '100%', // Full width for the background track
                margin: 0, // No margin between the background and the progress line
              },
             
              dataLabels: {
                name: {
                  offsetY: -10,
                  show: false,
                  color: "#888",
                  fontSize: "13px"
                },
                value: {
                  color: "#111",
                  fontSize: "30px",
                  show: false
                }
              }
            }
          },
          fill: {
            colors: ['#fff']

          },
        
          stroke: {
            lineCap: "round",
          },
          labels: ["Progress"]
        };
      
    
    
      // Bar chart configuration
      const barOptions: ApexCharts.ApexOptions = {
        chart: {
          type: 'bar',
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            borderRadius: 10, // Set high value for rounded corners
            columnWidth: '50%', // Adjust this for the width of the bars
            dataLabels: {
              position: 'top', // Just in case, set position but keep disabled
            },
            startingShape: 'rounded', // Important! Ensures bars are rounded at the ends
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#FFFFFF'], // White-colored bars
        xaxis: {
          categories: ['', '', '', '', '', ''], // Empty to hide axis labels
          axisBorder: { show: false }, // Hides the x-axis border
          axisTicks: { show: false }, // Hides the x-axis ticks
        },
        yaxis: { show: false }, // Hide y-axis
        grid: { show: false }, // Hide grid lines
        tooltip: { enabled: true }, // Disable tooltips if you don't want any interaction
      };
      
      


    return (

        <Card sx={{height:424,borderRadius:"8px",bgcolor:bgColor,width:"50%" ,}} >
        <Stack alignItems={"center"} justifyContent={"center"}>

        <Box
      sx={{
        width: 230,
        height: 230,
        position: 'relative',
      }}
    >
        <ApexChart options={donutOptions} series={donutSeries} type="radialBar" height= {250} />
      
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography fontSize={24} fontWeight={600} color={"#fff"}>
          {` ${donutSeries[0]} %`}
        </Typography>
        <Typography fontSize={12} fontWeight={600} color={"#fff"}>
          {title}
        </Typography>
      </Box>
      </Box>

        


        <Box sx={{ mt: 5, width: '60%' }}>
        <ApexChart options={barOptions} series={barSeries} type="bar" height="150" />
        </Box>
            
        </Stack>

        </Card>

        
     
    );
};

export default ColorlyCardInProductionDetail;