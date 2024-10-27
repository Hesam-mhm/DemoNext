import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import moment from 'jalali-moment';

type MessagesComponentProps = {
  title: string;
  summary: string;
  date: string;
};

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

  return (
    <>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
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
      <Divider variant="fullWidth" />
    </>
  );
};

export default MessagesComponent;
