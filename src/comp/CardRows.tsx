import { Stack, Typography } from '@mui/material';
import React from 'react';

type CardRowsProps ={
    title : string ,
    value : string ,
    color: string ,
    bgColor: string ,
}

const CardRows = ({title,value,color,bgColor}:CardRowsProps) => {

    return (
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} my={2}>

        <Typography fontWeight={400} fontSize={16} color={"#555555"}>
        {title}
        </Typography>
        
        <Stack 
        alignSelf={"center"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          bgcolor:bgColor,
          border:"1px solid",
          borderColor: color,
          borderRadius:"8px",
          width:"60px" ,
          height:"48px"
        }} >
          <Typography fontWeight={500} fontSize={14} color={color}>
            {value}  </Typography>
        </Stack>

        </Stack>
    );
};

export default CardRows;