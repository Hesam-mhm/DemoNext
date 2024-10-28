import { Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { motion } from "framer-motion";


const AnimatedCard = motion(Stack);



type MessagesComponentProps ={
  title : string ,
  summary: string ,
  date: string,
  animate : boolean
}


const MessagesComponent = ({ summary, title, date }: MessagesComponentProps) => {
  const jalaliDate = moment(date).locale('fa').startOf('day');
  const today = moment().startOf('day');
  const daysDifference = today.diff(jalaliDate, 'days');

  const getDisplayDate = () => {
    if (daysDifference === 0) {
      return 'امروز';
    } else if (daysDifference === 1) {
      return 'دیروز';
    } else {
      return jalaliDate.format('jD jMMMM');
    }
  };

const MessagesComponent = ({summary,title,date,animate}:MessagesComponentProps) => {
  return (
    <>
        <AnimatedCard
      sx={{
        boxShadow :"none",
        minWidth: 275,
        my: 5,
        backgroundColor: "white", // Set background color based on animation
        opacity: animate ? 1 : 0, // Set opacity based on animation
        y: animate ? 0 : -20, //
      }}
      initial={{
        opacity: 0,

        // backgroundColor : "red",
        y: 0,
      }}
      animate={
        animate
          ? {
              opacity: 1,
              backgroundColor: "white",
              y: 0,
            }
          : {}
      }
      exit={{ opacity: 0, y: 0 }}
      transition={{
        duration: .5,

        // delay: 0.5,
      }}
    >
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={2}>

        <Stack>
          <Typography fontWeight={500} fontSize={14} color={'#555555'}>
            {title}
          </Typography>
          <Typography fontWeight={400} fontSize={12} color={'#aaaaaa'} mt={"16px"}>
            {summary}
          </Typography>
        </Stack>

        <Typography fontWeight={300} fontSize={11} color={'#c6c6c6'}>
          {getDisplayDate()}
        </Typography>
      </Stack>
      <Divider variant='fullWidth' />
      </AnimatedCard>

    </>
  );
};

export default MessagesComponent;
