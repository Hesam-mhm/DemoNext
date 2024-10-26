import { Divider, Stack, Typography } from '@mui/material'
import React from 'react'

type MessagesComponentProps ={
  title : string ,
  summary: string ,
  date: string
}


const MessagesComponent = ({summary,title,date}:MessagesComponentProps) => {
  return (
    <>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={2}>
        <Stack>
          <Typography fontWeight={500} fontSize={14} color={'#555555'}>
            {title}
          </Typography>
          <Typography fontWeight={400} fontSize={12} color={'#aaaaaa'}>
            {summary}
          </Typography>
        </Stack>

        <Typography fontWeight={300} fontSize={11} color={'#c6c6c6'}>
        {date}
        </Typography>
      </Stack>
      <Divider variant='middle' />
    </>
  )
}

export default MessagesComponent
