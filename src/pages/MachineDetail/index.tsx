/* eslint-disable @typescript-eslint/no-unused-vars */
import { Icon } from '@iconify/react'
import { Box, Card, Divider, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import CardRows from 'src/comp/CardRows'
import { MachineType, MessagesType } from 'src/types/ProductionLine.type'
import TimelineChart from 'src/comp/timeLineChart'
import MessagesComponent from 'src/comp/MessagesComponent'
import ColumnChart from 'src/comp/ColumnChart'
import generateRandomData from 'src/helper/dateGenerator'
import GaugeChart from 'src/comp/GaugeChart'

interface ShiftDataType {
  name: string
  data: number[]
}
interface GaugeDataType {
  oee: number
  quality: number
  energy: number
  rate: number
}

const MachineDetail = () => {
  const [machinesList, setMachinesList] = useState<MachineType[]>([])
  const [alertList, setAlertList] = useState<MessagesType[]>([])
  const [messageList, setMessageList] = useState<MessagesType[]>([])
  const [columnList, setColumnList] = useState<ShiftDataType[]>([])
  const [gaugeData, setGaugeData] = useState<GaugeDataType>({energy:84,oee:81,quality:74,rate:56,})


  useEffect(() => {
    const interval = setInterval(() => {
      setGaugeData({
        energy: Math.floor(Math.random() * (95 - 10 + 1)) + 10,
        oee: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
        quality: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
        rate: Math.floor(Math.random() * (240 - 150 + 1)) + 150,
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomDataForColumnChart = () => {
    return [
      {
        name: 'شیفت 1',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 151) + 50)
      },
      {
        name: 'شیفت 2',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 151) + 50)
      },
      {
        name: 'شیفت 3',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 151) + 50)
      }
    ]
  }

  useEffect(() => {
    setColumnList(generateRandomDataForColumnChart())

    const interval = setInterval(() => {
      setColumnList(prevColumnList => {
        return prevColumnList.map(shift => {
          const newData = [...shift.data]
          const lastValue = newData[newData.length - 1]

          // تولید یک عدد تصادفی جدید با حداکثر اختلاف 10
          const randomChange = Math.floor(Math.random() * 21) - 10 // بین -10 و 10
          const newValue = lastValue + randomChange

          // اطمینان از اینکه مقدار جدید در محدوده 50 تا 200 قرار گیرد
          newData[newData.length - 1] = Math.max(50, Math.min(newValue, 200))

          return { ...shift, data: newData }
        })
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchMachine()
    fetchMessageService()
  }, [])

  const fetchMachine = async () => {
    const response = await axios.get('http://185.105.187.116:4002/sm/self_machines?department_name=خط تولید پوشاک')
    if (response.status >= 200 && response.status < 300) {
      setMachinesList(response.data.data as MachineType[])
    }
  }

  const fetchMessageService = async () => {
    const res = await axios.get(`http://45.156.185.218:7008/message_service/list?message_type=PM&entity_type=machine`)
    if (res.status >= 200 && res.status < 300) {
      setMessageList(res.data.data as MessagesType[])
    }

    const alertRes = await axios.get(
      `http://45.156.185.218:7008/message_service/list?message_type=AI&entity_type=machine`
    )
    if (alertRes.status >= 200 && alertRes.status < 300) {
      setAlertList(alertRes.data.data as MessagesType[])
    }
  }

  return (
    <Grid container height={'100%'}>
      {/* Right Side */}
      <Grid p={2} item lg={3} xs={12}>
        <Card
          sx={{
            p: 3,
            backgroundColor: 'white',
            height: 920,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Stack sx={{ flexGrow: 1 }}>
            <Stack
              sx={{
                mb: 0,
                width: '100%',
                flexGrow: 1,
                maxHeight: 350,
                bgcolor: '#F9F9F9',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img alt='' src={'/images/image-placeholder.png'} style={{ width: 84, height: 84 }} />
            </Stack>
            <Stack width='100%' p={0} m={0}>
              <TimelineChart machinesData={generateRandomData('Machine 2', '2023-06-20 00:00', 6)} />
            </Stack>

            <Stack
              p={4}
              direction={'column'}
              sx={{
                border: '2px solid ',
                borderColor: '#4c4e641f',
                borderRadius: '8px',
                pb: '16px',
                flexGrow: 0
              }}
            >
              <Stack direction={'row'} my={2}>
                <Icon icon={'tabler:settings-2'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  ماشین ۱
                </Typography>
              </Stack>
              <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  برند
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  برند ۱
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  نام اپراتور
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  محمدجواد فتوت
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  تاریخ تولید
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  ۱۴۰۲
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  دسته‌بندی
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  کوره نگهدارنده
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  زیرمجموعه
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  زیرمجموعه ۱
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} my={3}>
                <Typography fontWeight={500} fontSize={14}>
                  ظرفیت تولید
                </Typography>
                <Typography fontWeight={500} fontSize={14}>
                  50
                </Typography>
              </Stack>
              <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
              <CardRows
                title={'وضعیت'}
                value={'فعال'}
                color={true ? '#00B051' : '#FF0000'}
                bgColor={true ? '#DFF5E9' : '#FFDFDF'}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>

      {/* Left side */}
      <Grid container item lg={9} height={940}>
        {/* Charts Card */}
        <Grid p={2} item lg={6} xs={12} direction={'column'}>
          <Card sx={{ borderRadius: '8px', height: 444, p: '16px', overflow: 'auto' }}>
            <Grid container spacing={2} sx={{ pb: '16px' }}>
              <Grid item lg={6} xs={12}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    height: 192,
                    boxShadow: 'none',
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <GaugeChart value={gaugeData.oee} lable='OEE'  min={0} max={100}/>
                </Card>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    height: 192,
                    boxShadow: 'none',
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <GaugeChart value={gaugeData.quality} lable='کیفیت تولید'  min={0} max={100}/>
                </Card>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} xs={12}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    height: 192,
                    boxShadow: 'none',
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <GaugeChart value={gaugeData.rate} lable='نرخ تولید' withPercentage={false} min={0} max={250}/>
                </Card>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    height: 192,
                    boxShadow: 'none',
                    border: theme => `1px solid ${theme.palette.divider}`
                  }}
                >
                  <GaugeChart value={gaugeData.energy} lable='مصرف انرژی' min={0} max={100}/>
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Column Chart */}
        <Grid p={2} item lg={6} xs={12} direction={'column'}>
          <Card sx={{ borderRadius: '8px', height: 444 }}>
            <Stack direction={'row'} ml={'24px'}my={'16px'} mr={"32px"} justifyContent={'space-between'}>
              <Stack direction={'row'}>
                <Icon icon={'lets-icons:chart-alt-light'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={15} color={'#1c1c1c'} ml={2}>
                  نمودار نرخ تولید در هفته گذشته
                </Typography>
              </Stack>
              <Stack direction={'row'} alignItems='center'>
                <ColoredDot color='#FF9600' />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  شیفت 3
                </Typography>
              </Stack>
              <Stack direction={'row'} alignItems='center'>
                <ColoredDot color='#00B051' />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  شیفت 2
                </Typography>
              </Stack>
              <Stack direction={'row'} alignItems='center'>
                <ColoredDot color='#009DFF' />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  شیفت ۱
                </Typography>
              </Stack>
            </Stack>
            <ColumnChart series={columnList} />
          </Card>
        </Grid>

        {/* Bottom side */}
        <Grid p={2} m={2} item container lg={12} xs={12} component={Card} sx={{ borderRadius: '8px' }}>
          {/* پیام‌های تعمیر و نگهداری */}
          <Grid lg={6} xs={12} component={Stack} direction={'column'} p={2}>
            <Stack sx={{ border: '2px solid ', borderColor: '#4c4e641f', borderRadius: '8px', height: 410 }} p={4}>
              <Stack direction={'row'} my={2}>
                <Icon icon={'tabler:message'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  پیام‌های تعمیر و نگهداری
                </Typography>
              </Stack>
              <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
              <Box
                sx={{
                  m: 0,
                  p: 0,
                  overflowY: 'auto',
                  flexGrow: 1,
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                }}
              >
                {messageList.length ? (
                  messageList.map((message, index) => (
                    <MessagesComponent
                      key={index}
                      date={message.time}
                      summary={message.summary}
                      title={message.title}
                    />
                  ))
                ) : (
                  <Typography>پیامی وجود ندارد!</Typography>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* هشدارهای پیش‌بینی‌کننده */}
          <Grid lg={6} xs={12} component={Stack} direction={'column'} p={2}>
            <Stack sx={{ border: '2px solid ', borderColor: '#4c4e641f', borderRadius: '8px', height: 410 }} p={4}>
              <Stack direction={'row'} my={2}>
                <Icon icon={'tdesign:notification'} fontSize={20} fontWeight={500} />
                <Typography fontWeight={500} fontSize={14} color={'#1c1c1c'} ml={2}>
                  هشدارهای پیش‌بینی‌کننده
                </Typography>
              </Stack>
              <Divider variant='fullWidth' sx={{ borderWidth: '1px' }} />
              <Box
                sx={{
                  m: 0,
                  p: 0,
                  overflowY: 'auto',
                  flexGrow: 1,
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                }}
              >
                {alertList.length ? (
                  alertList.map((alert, index) => (
                    <MessagesComponent key={index} date={alert.time} summary={alert.summary} title={alert.title} />
                  ))
                ) : (
                  <Typography>هشداری وجود ندارد!</Typography>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MachineDetail

const ColoredDot: React.FC<{ color: string }> = ({ color }) => (
  <Box
    sx={{
      width: 10,
      height: 10,
      borderRadius: '50%',
      backgroundColor: color,
      display: 'inline-block'
    }}
  />
)
