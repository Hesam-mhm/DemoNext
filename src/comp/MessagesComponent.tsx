import React from 'react'
import { Divider, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import moment from 'jalali-moment'

type MessagesComponentProps = {
  title: string
  summary: string
  date: string
  animate: boolean
}

const MessagesComponent = ({ summary, title, date, animate }: MessagesComponentProps) => {
  const gregorianDate = moment(date, 'jYYYY-jMM-jDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
  const jalaliDate = moment(gregorianDate).locale('fa').startOf('day')
  const today = moment().startOf('day')
  const daysDifference = today.diff(jalaliDate, 'days')

  const getDisplayDate = () => {
    if (daysDifference === 0) {
      return 'امروز'
    } else if (daysDifference === 1) {
      return 'دیروز'
    } else {
      return jalaliDate.format('jD jMMMM')
    }
  }

  return (
    <Stack
      component={motion.div} // <--- Motion applied here
      sx={{
        boxShadow: 'none',
        minWidth: 275,
        my: 5,
        backgroundColor: 'white',
        opacity: animate ? 1 : 0,
        y: animate ? 0 : -20,
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
        <Stack>
          <Typography fontWeight={500} fontSize={14} color="#555555">
            {title}
          </Typography>
          <Typography fontWeight={400} fontSize={12} color="#aaaaaa" mt="16px">
            {summary}
          </Typography>
        </Stack>
        <Typography fontWeight={300} fontSize={11} color="#c6c6c6">
          {getDisplayDate()}
        </Typography>
      </Stack>
      <Divider variant="fullWidth" />
    </Stack>
  )
}

export default MessagesComponent
